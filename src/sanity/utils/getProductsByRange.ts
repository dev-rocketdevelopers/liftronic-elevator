import { productRangeBySlugQuery } from "../lib/queries";
import type { ProductRangeFull } from "../lib/productRangeTypes";
import { sanityFetch, SANITY_CACHE_TAGS } from "../lib/cache";

/**
 * Fetches a product range by slug with all its products
 * @param slug - The slug of the product range
 * @returns Promise<ProductRangeFull | null> Product range with products or null if not found
 */
export async function getProductRangeBySlug(
  slug: string,
): Promise<ProductRangeFull | null> {
  return sanityFetch<ProductRangeFull | null>({
    query: productRangeBySlugQuery,
    params: { slug },
    tags: [SANITY_CACHE_TAGS.productRanges],
  });
}
