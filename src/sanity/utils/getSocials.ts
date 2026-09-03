import { groq } from "next-sanity";
import { cache } from "react";
import { Social } from "../../../typings";
import { sanityFetch, SANITY_CACHE_TAGS } from "../lib/cache";

export const getSocial = cache(async (): Promise<Social[]> => {
  const query = groq`*[_type == "social"]{
    _id,
    title,
    icon,
    url,
    tags[]->{
      _id,
      title,
      slug
    }
  }`;
  return sanityFetch<Social[]>({
    query,
    tags: [SANITY_CACHE_TAGS.socials],
  });
});
