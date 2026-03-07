import { groq } from "next-sanity";
import { cache } from "react";
import { KeyFeature } from "../../../typings";
import { client } from "../lib/client";
import { sanityFetchOptions } from "../lib/fetchOptions";

export const getKeyFeatures = cache(async (): Promise<KeyFeature[]> => {
  const query = groq`*[_type == "keyFeature"]{
    _id,
    title,
    description,
    icon
  }`;
  return client.fetch<KeyFeature[]>(query, {}, sanityFetchOptions);
});
