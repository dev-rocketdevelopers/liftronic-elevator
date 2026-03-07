import { groq } from "next-sanity";
import { cache } from "react";
import { Product } from "../../../typings";
import { client } from "../lib/client";
import { sanityFetchOptions } from "../lib/fetchOptions";

export const getProducts = cache(async (): Promise<Product[]> => {
  const query = groq`*[_type == "product"]{
    _id,
    title,
    subtitle,
    description,
    tags[]->{
      _id,
      title,
      slug
    },
    faqs[]->{
      _id,
      question,
      answer
    },
    keyFeatures[0...6]->{
      _id,
      title,
      description,
      icon
    },
    specifications[]{
      label,
      value
    }
  }`;
  return client.fetch<Product[]>(query, {}, sanityFetchOptions);
});
