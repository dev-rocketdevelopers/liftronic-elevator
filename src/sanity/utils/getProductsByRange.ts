import { client } from "../lib/client";
import { productRangeBySlugQuery } from "../lib/queries";
import type { ProductRangeFull } from "../lib/productRangeTypes";

/**
 * Fetches a product range by slug with all its products
 * @param slug - The slug of the product range
 * @returns Promise<ProductRangeFull | null> Product range with products or null if not found
 */
export async function getProductRangeBySlug(
  slug: string,
): Promise<ProductRangeFull | null> {
  return client.fetch<ProductRangeFull | null>(
    productRangeBySlugQuery,
    { slug },
    { next: { revalidate: 86400 } }, // Revalidate daily
  );
}
