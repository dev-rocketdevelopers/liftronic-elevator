import { groq } from "next-sanity";
import { Product } from "../../../typings";
import { sanityFetch, SANITY_CACHE_TAGS } from "../lib/cache";

export async function getProducts(): Promise<Product[]> {
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
  return sanityFetch<Product[]>({
    query,
    tags: [SANITY_CACHE_TAGS.products],
  });
}
