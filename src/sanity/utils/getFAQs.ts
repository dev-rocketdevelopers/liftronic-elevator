import { groq } from "next-sanity";
import { cache } from "react";
import { FAQ } from "../../../typings";
import { client } from "../lib/client";
import { sanityFetchOptions } from "../lib/fetchOptions";

export const getFAQs = cache(async (): Promise<FAQ[]> => {
  const query = groq`*[_type == "faq"]{
    _id,
    question,
    answer
  }`;
  return client.fetch<FAQ[]>(query, {}, sanityFetchOptions);
});
