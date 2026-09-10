import { revalidatePath, revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { dataset, projectId } from "~/sanity/env";
import {
  isPublicSanityType,
  resolveRevalidationTargets,
  type SanityOperation,
  type SanityWebhookPayload,
  type WebhookDocumentSnapshot,
} from "~/sanity/lib/revalidation";

export const runtime = "nodejs";

const VALID_OPERATIONS = new Set<SanityOperation>([
  "create",
  "delete",
  "update",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSnapshot(value: unknown): value is WebhookDocumentSnapshot | null {
  return value === null || value === undefined || isRecord(value);
}

function parsePayload(value: unknown): SanityWebhookPayload | null {
  if (!isRecord(value)) return null;

  const id = value._id;
  const type = value._type;
  if (
    typeof id !== "string" ||
    typeof type !== "string" ||
    !isPublicSanityType(type) ||
    !isSnapshot(value.before) ||
    !isSnapshot(value.after)
  ) {
    return null;
  }

  return {
    _id: id,
    _type: type,
    before: value.before as WebhookDocumentSnapshot | null | undefined,
    after: value.after as WebhookDocumentSnapshot | null | undefined,
  };
}

function getOperation(request: Request): SanityOperation | null {
  const operation = request.headers.get("sanity-operation");
  return operation && VALID_OPERATIONS.has(operation as SanityOperation)
    ? (operation as SanityOperation)
    : null;
}

export async function POST(request: NextRequest): Promise<Response> {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    console.error("Sanity revalidation is missing its server secret");
    return Response.json(
      { message: "Revalidation is not configured" },
      { status: 500 },
    );
  }

  let parsedBody: unknown;
  let isValidSignature: boolean | null;

  try {
    const parsed = await parseBody<unknown>(request, secret, true);
    parsedBody = parsed.body;
    isValidSignature = parsed.isValidSignature;
  } catch (error) {
    console.warn("Sanity revalidation received malformed JSON", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return Response.json({ message: "Malformed payload" }, { status: 400 });
  }

  if (isValidSignature !== true) {
    return Response.json({ message: "Invalid signature" }, { status: 401 });
  }

  const sourceProject = request.headers.get("sanity-project-id");
  const sourceDataset = request.headers.get("sanity-dataset");
  if (sourceProject !== projectId || sourceDataset !== dataset) {
    return Response.json(
      { message: "Unexpected Sanity project or dataset" },
      { status: 400 },
    );
  }

  const operation = getOperation(request);
  if (!operation) {
    return Response.json({ message: "Invalid operation" }, { status: 400 });
  }

  if (
    isRecord(parsedBody) &&
    typeof parsedBody._type === "string" &&
    !isPublicSanityType(parsedBody._type)
  ) {
    return Response.json({ ignored: true, type: parsedBody._type });
  }

  const payload = parsePayload(parsedBody);
  if (!payload) {
    return Response.json({ message: "Malformed payload" }, { status: 400 });
  }

  try {
    const targets = await resolveRevalidationTargets(payload);

    for (const tag of targets.tags) {
      revalidateTag(tag);
    }
    for (const target of targets.paths) {
      revalidatePath(target.path, target.type);
    }

    console.info("Sanity cache revalidation completed", {
      documentId: payload._id,
      documentType: payload._type,
      idempotencyKey: request.headers.get("idempotency-key"),
      operation,
      pathCount: targets.paths.length,
      tagCount: targets.tags.length,
    });

    return Response.json({
      revalidated: true,
      operation,
      pathCount: targets.paths.length,
      paths: targets.paths,
      tagCount: targets.tags.length,
      tags: targets.tags,
    });
  } catch (error) {
    console.error("Sanity cache revalidation failed", {
      documentId: payload._id,
      documentType: payload._type,
      error: error instanceof Error ? error.message : "Unknown error",
      idempotencyKey: request.headers.get("idempotency-key"),
      operation,
    });
    return Response.json({ message: "Revalidation failed" }, { status: 500 });
  }
}
