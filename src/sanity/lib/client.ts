import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Public reads use the CDN. Signed webhooks wait for CDN propagation before invalidating.
  useCdn: true,
  // Add timeout and retry configuration
  requestTagPrefix: "sanity",
  perspective: "published",
  stega: {
    enabled: false,
    studioUrl: "/studio",
  },
});
