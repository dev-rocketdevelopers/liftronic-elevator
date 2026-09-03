import { groq } from "next-sanity";
import { Performance } from "../../../typings";
import { sanityFetch, SANITY_CACHE_TAGS } from "../lib/cache";

export async function getPerformances(): Promise<Performance[]> {
  const query = groq`*[_type == "performance"]{
    _id,
    performanceTitle,
    performanceFigure,
    performancePic{
      asset->{_id, url},
      alt
    }
  }`;
  return sanityFetch<Performance[]>({
    query,
    tags: [SANITY_CACHE_TAGS.services],
  });
}
