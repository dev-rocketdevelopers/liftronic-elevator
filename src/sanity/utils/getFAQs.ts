import { groq } from "next-sanity";
import { FAQ } from "../../../typings";
import { sanityFetch, SANITY_CACHE_TAGS } from "../lib/cache";

export async function getFAQs(): Promise<FAQ[]> {
  const query = groq`*[_type == "faq"]{
    _id,
    question,
    answer
  }`;
  return sanityFetch<FAQ[]>({
    query,
    tags: [SANITY_CACHE_TAGS.homeSettings],
  });
}
