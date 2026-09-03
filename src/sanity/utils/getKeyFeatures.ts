import { groq } from "next-sanity";
import { KeyFeature } from "../../../typings";
import { sanityFetch, SANITY_CACHE_TAGS } from "../lib/cache";

export async function getKeyFeatures(): Promise<KeyFeature[]> {
  const query = groq`*[_type == "keyFeature"]{
    _id,
    title,
    description,
    icon
  }`;
  return sanityFetch<KeyFeature[]>({
    query,
    tags: [SANITY_CACHE_TAGS.products],
  });
}
