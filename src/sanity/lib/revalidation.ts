import { groq } from "next-sanity";
import { SANITY_CACHE_TAGS, SANITY_DETAIL_TAGS } from "~/sanity/lib/cache";
import { client } from "~/sanity/lib/client";

export const PUBLIC_SANITY_TYPES = [
  "author",
  "branch",
  "category",
  "certificate",
  "client",
  "companyInfo",
  "contactInfo",
  "faq",
  "homePageSeo",
  "homePageSettings",
  "keyFeature",
  "media",
  "popup",
  "post",
  "product",
  "productRange",
  "service",
  "social",
  "tag",
  "teamMember",
  "testimonial",
  "timeline",
  "visionMissionValues",
  "whyChooseUs",
] as const;

export type PublicSanityType = (typeof PUBLIC_SANITY_TYPES)[number];
export type SanityOperation = "create" | "delete" | "update";

export type WebhookLocationPage = {
  citySlug?: string | null;
  published?: boolean | null;
};

export type WebhookDocumentSnapshot = {
  address?: string | null;
  city?: string | null;
  description?: string | null;
  email?: string | null;
  featured?: boolean | null;
  isActive?: boolean | null;
  locationPages?: WebhookLocationPage[] | null;
  mapUrl?: string | null;
  name?: string | null;
  order?: number | null;
  phone?: string | null;
  slug?: string | null;
};

export type SanityWebhookPayload = {
  _id: string;
  _type: PublicSanityType;
  after?: WebhookDocumentSnapshot | null;
  before?: WebhookDocumentSnapshot | null;
};

export type RevalidationPath = {
  path: string;
  type?: "layout" | "page";
};

export type RevalidationTargets = {
  paths: RevalidationPath[];
  tags: string[];
};

type SlugTarget = { slug?: string | null };

type ReferenceTargets = {
  branches: SlugTarget[];
  homeSettings: Array<{ _id: string }>;
  posts: SlugTarget[];
  productRanges: Array<{ _id: string }>;
  products: SlugTarget[];
  services: SlugTarget[];
  socials: Array<{ _id: string }>;
};

const dependencyClient = client.withConfig({ useCdn: false });

export function isPublicSanityType(value: string): value is PublicSanityType {
  return (PUBLIC_SANITY_TYPES as readonly string[]).includes(value);
}

function isNavigationChange(
  before: WebhookDocumentSnapshot | null | undefined,
  after: WebhookDocumentSnapshot | null | undefined,
): boolean {
  const selectNavigationFields = (
    value: WebhookDocumentSnapshot | null | undefined,
  ) => ({
    address: value?.address ?? null,
    city: value?.city ?? null,
    description: value?.description ?? null,
    email: value?.email ?? null,
    isActive: value?.isActive ?? null,
    mapUrl: value?.mapUrl ?? null,
    name: value?.name ?? null,
    order: value?.order ?? null,
    phone: value?.phone ?? null,
    slug: value?.slug ?? null,
  });

  return (
    JSON.stringify(selectNavigationFields(before)) !==
    JSON.stringify(selectNavigationFields(after))
  );
}

async function getReferenceTargets(id: string): Promise<ReferenceTargets> {
  return dependencyClient.fetch<ReferenceTargets>(
    groq`{
      "posts": *[_type == "post" && references($id) && defined(slug.current)] {
        "slug": slug.current
      },
      "products": *[_type == "product" && references($id) && defined(slug.current)] {
        "slug": slug.current
      },
      "services": *[_type == "service" && references($id) && defined(slug.current)] {
        "slug": slug.current
      },
      "branches": *[_type == "branch" && references($id) && defined(slug.current)] {
        "slug": slug.current
      },
      "productRanges": *[_type == "productRange" && references($id)] { _id },
      "homeSettings": *[_type == "homePageSettings" && references($id)] { _id },
      "socials": *[_type == "social" && references($id)] { _id }
    }`,
    { id },
    {
      cache: "no-store",
      perspective: "published",
    },
  );
}

function addSlugTargets(
  targets: RevalidationTargetsBuilder,
  items: SlugTarget[],
  kind: "branch" | "post" | "product" | "service",
): void {
  for (const item of items) {
    if (!item.slug) continue;

    const prefixes = {
      branch: "/branches",
      post: "/blogs",
      product: "/products",
      service: "/services",
    } as const;

    targets.addTag(SANITY_DETAIL_TAGS[kind](item.slug));
    targets.addPath(`${prefixes[kind]}/${item.slug}`);
  }
}

class RevalidationTargetsBuilder {
  private readonly pathMap = new Map<string, RevalidationPath>();
  private readonly tagSet = new Set<string>();

  addPath(path: string, type?: "layout" | "page"): void {
    if (!path.startsWith("/")) return;
    const key = `${type ?? "exact"}:${path}`;
    this.pathMap.set(key, type ? { path, type } : { path });
  }

  addTag(tag: string): void {
    this.tagSet.add(tag);
  }

  build(): RevalidationTargets {
    return {
      paths: [...this.pathMap.values()].sort((a, b) =>
        a.path.localeCompare(b.path),
      ),
      tags: [...this.tagSet].sort(),
    };
  }
}

function addSnapshotSlugs(
  targets: RevalidationTargetsBuilder,
  payload: SanityWebhookPayload,
  kind: "branch" | "post" | "product" | "service",
): void {
  addSlugTargets(
    targets,
    [{ slug: payload.before?.slug }, { slug: payload.after?.slug }],
    kind,
  );
}

function addProductLocations(
  targets: RevalidationTargetsBuilder,
  payload: SanityWebhookPayload,
): void {
  for (const snapshot of [payload.before, payload.after]) {
    if (!snapshot?.slug) continue;

    const citySlugs = new Set(
      (snapshot.locationPages ?? [])
        .filter((location) => location.published !== false)
        .map((location) => location.citySlug)
        .filter((slug): slug is string => Boolean(slug)),
    );

    for (const citySlug of citySlugs) {
      targets.addTag(
        SANITY_DETAIL_TAGS.productLocation(snapshot.slug, citySlug),
      );
      targets.addPath(`/products/${snapshot.slug}/${citySlug}`);
    }
  }
}

export async function resolveRevalidationTargets(
  payload: SanityWebhookPayload,
): Promise<RevalidationTargets> {
  const targets = new RevalidationTargetsBuilder();
  let references: ReferenceTargets | null = null;

  const loadReferences = async (): Promise<ReferenceTargets> => {
    references ??= await getReferenceTargets(payload._id);
    return references;
  };

  switch (payload._type) {
    case "post": {
      targets.addTag(SANITY_CACHE_TAGS.blogs);
      targets.addTag(SANITY_CACHE_TAGS.blogSitemap);
      targets.addTag(SANITY_CACHE_TAGS.footerLinks);
      targets.addTag(SANITY_CACHE_TAGS.home);
      targets.addPath("/");
      targets.addPath("/blogs");
      targets.addPath("/blogs/sitemap.xml");
      addSnapshotSlugs(targets, payload, "post");
      addSlugTargets(targets, (await loadReferences()).posts, "post");
      break;
    }
    case "product": {
      targets.addTag(SANITY_CACHE_TAGS.home);
      targets.addTag(SANITY_CACHE_TAGS.productRanges);
      targets.addTag(SANITY_CACHE_TAGS.products);
      targets.addTag(SANITY_CACHE_TAGS.productSitemap);
      targets.addPath("/");
      targets.addPath("/products");
      targets.addPath("/products/sitemap.xml");
      addSnapshotSlugs(targets, payload, "product");
      addProductLocations(targets, payload);

      const productReferences = await loadReferences();
      addSlugTargets(targets, productReferences.branches, "branch");
      addSlugTargets(targets, productReferences.posts, "post");
      if (productReferences.productRanges.length > 0) {
        targets.addTag(SANITY_CACHE_TAGS.productRanges);
      }
      break;
    }
    case "service": {
      targets.addTag(SANITY_CACHE_TAGS.footerLinks);
      targets.addTag(SANITY_CACHE_TAGS.home);
      targets.addTag(SANITY_CACHE_TAGS.services);
      targets.addTag(SANITY_CACHE_TAGS.serviceSitemap);
      targets.addPath("/");
      targets.addPath("/services");
      targets.addPath("/services/[slug]", "page");
      targets.addPath("/services/sitemap.xml");
      addSnapshotSlugs(targets, payload, "service");
      break;
    }
    case "branch": {
      addSnapshotSlugs(targets, payload, "branch");
      if (isNavigationChange(payload.before, payload.after)) {
        targets.addTag(SANITY_CACHE_TAGS.branches);
        targets.addPath("/branches");
      }
      break;
    }
    case "media": {
      targets.addTag(SANITY_CACHE_TAGS.home);
      targets.addTag(SANITY_CACHE_TAGS.media);
      targets.addTag(SANITY_CACHE_TAGS.mediaSitemap);
      targets.addPath("/");
      targets.addPath("/media");
      targets.addPath("/media/sitemap.xml");
      break;
    }
    case "productRange": {
      targets.addTag(SANITY_CACHE_TAGS.footerLinks);
      targets.addTag(SANITY_CACHE_TAGS.productRanges);
      targets.addPath("/products");
      break;
    }
    case "author":
    case "category": {
      const related = await loadReferences();
      targets.addTag(SANITY_CACHE_TAGS.blogs);
      targets.addTag(SANITY_CACHE_TAGS.home);
      targets.addPath("/");
      targets.addPath("/blogs");
      addSlugTargets(targets, related.posts, "post");
      break;
    }
    case "tag": {
      const related = await loadReferences();
      targets.addTag(SANITY_CACHE_TAGS.blogs);
      targets.addTag(SANITY_CACHE_TAGS.home);
      targets.addTag(SANITY_CACHE_TAGS.productRanges);
      targets.addTag(SANITY_CACHE_TAGS.products);
      targets.addPath("/");
      targets.addPath("/blogs");
      targets.addPath("/products");
      addSlugTargets(targets, related.posts, "post");
      addSlugTargets(targets, related.products, "product");
      if (related.socials.length > 0) {
        targets.addTag(SANITY_CACHE_TAGS.socials);
      }
      break;
    }
    case "faq": {
      const related = await loadReferences();
      addSlugTargets(targets, related.products, "product");
      addSlugTargets(targets, related.services, "service");
      if (related.homeSettings.length > 0) {
        targets.addTag(SANITY_CACHE_TAGS.homeSettings);
        targets.addPath("/");
      }
      break;
    }
    case "keyFeature": {
      addSlugTargets(targets, (await loadReferences()).products, "product");
      break;
    }
    case "companyInfo": {
      targets.addTag(SANITY_CACHE_TAGS.companyInfo);
      targets.addPath("/");
      targets.addPath("/aboutus");
      break;
    }
    case "certificate":
    case "teamMember":
    case "timeline":
    case "visionMissionValues":
    case "whyChooseUs": {
      targets.addTag(SANITY_CACHE_TAGS.about);
      targets.addPath("/aboutus");
      break;
    }
    case "client":
    case "testimonial": {
      targets.addTag(SANITY_CACHE_TAGS.home);
      targets.addPath("/");
      break;
    }
    case "homePageSeo": {
      targets.addTag(SANITY_CACHE_TAGS.homeSeo);
      targets.addPath("/");
      break;
    }
    case "homePageSettings": {
      targets.addTag(SANITY_CACHE_TAGS.forms);
      targets.addTag(SANITY_CACHE_TAGS.homeSettings);
      targets.addPath("/");
      targets.addPath("/branches/[slug]", "page");
      targets.addPath("/contact");
      break;
    }
    case "contactInfo": {
      targets.addTag(SANITY_CACHE_TAGS.contactInfo);
      targets.addPath("/");
      targets.addPath("/contact");
      break;
    }
    case "social": {
      targets.addTag(SANITY_CACHE_TAGS.socials);
      targets.addPath("/");
      break;
    }
    case "popup": {
      targets.addTag(SANITY_CACHE_TAGS.popups);
      break;
    }
  }

  return targets.build();
}
