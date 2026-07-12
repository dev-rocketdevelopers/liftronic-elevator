import { groq } from "next-sanity";
import { cache } from "react";
import { Social } from "../../../typings";
import { client } from "../lib/client";

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
  return client.fetch<Social[]>(query, {}, { next: { revalidate: 86400 } });
});
