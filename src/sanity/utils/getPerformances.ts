import { groq } from "next-sanity";
import { cache } from "react";
import { client } from "../lib/client";
import { Performance } from "../../../typings";
import { sanityFetchOptions } from "../lib/fetchOptions";

export const getPerformances = cache(async (): Promise<Performance[]> => {
  const query = groq`*[_type == "performance"]{
    _id,
    performanceTitle,
    performanceFigure,
    performancePic{
      asset->{_id, url},
      alt
    }
  }`;
  return client.fetch<Performance[]>(query, {}, sanityFetchOptions);
});
