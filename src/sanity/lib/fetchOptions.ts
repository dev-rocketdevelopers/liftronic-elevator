export const SANITY_REVALIDATE_SECONDS = 3600;

export const sanityFetchOptions = {
  next: { revalidate: SANITY_REVALIDATE_SECONDS },
} as const;
