import { groq } from "next-sanity";
import { Tag } from "../../../typings";
import { sanityFetch, SANITY_CACHE_TAGS } from "../lib/cache";

export async function getTags(): Promise<Tag[]> {
  const query = groq`*[_type == "tag"]{
    _id,
    title,
    slug
  }`;
  return sanityFetch<Tag[]>({
    query,
    tags: [SANITY_CACHE_TAGS.blogs, SANITY_CACHE_TAGS.products],
  });
}
