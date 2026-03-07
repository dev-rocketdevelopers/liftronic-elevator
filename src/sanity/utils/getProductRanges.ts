import { cache } from "react";
import { client } from "../lib/client";
import { sanityFetchOptions } from "../lib/fetchOptions";
import { productRangesQuery } from "../lib/queries";
import type { ProductRange } from "../lib/productRangeTypes";

/**
 * Fetches all product ranges ordered by featured status, order field, and title
 * @returns Promise<ProductRange[]> Array of product ranges
 */
export const getProductRanges = cache(async (): Promise<ProductRange[]> => {
  return client.fetch<ProductRange[]>(
    productRangesQuery,
    {},
    sanityFetchOptions,
  );
});
