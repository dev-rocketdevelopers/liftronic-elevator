import { productRangesQuery } from "../lib/queries";
import type { ProductRange } from "../lib/productRangeTypes";
import { sanityFetch, SANITY_CACHE_TAGS } from "../lib/cache";

/**
 * Fetches all product ranges ordered by featured status, order field, and title
 * @param isFeaturedFilter Optional filter parameter to narrow results (e.g. true)
 * @returns Promise<ProductRange[]> Array of product ranges
 */
export async function getProductRanges(
  isFeaturedFilter?: boolean,
): Promise<ProductRange[]> {
  let ranges = await sanityFetch<ProductRange[]>({
    query: productRangesQuery,
    tags: [SANITY_CACHE_TAGS.productRanges],
  });

  // Apply filter if specified
  if (isFeaturedFilter) {
    ranges = ranges
      .map((range) => {
        // Keep only featured products within the range
        const featuredProducts = range.products.filter(
          (product) => product.featured === true,
        );
        return {
          ...range,
          products: featuredProducts,
          productCount: featuredProducts.length,
        };
      })
      // Only keep ranges that have at least one featured product
      .filter((range) => range.productCount > 0);
  }

  return ranges;
}
