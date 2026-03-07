import { groq } from "next-sanity";
import { cache } from "react";
import { Tag } from "../../../typings";
import { client } from "../lib/client";
import { sanityFetchOptions } from "../lib/fetchOptions";

export const getTags = cache(async (): Promise<Tag[]> => {
  const query = groq`*[_type == "tag"]{
    _id,
    title,
    slug
  }`;
  return client.fetch<Tag[]>(query, {}, sanityFetchOptions);
});
