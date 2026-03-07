import { groq } from "next-sanity";
import { cache } from "react";
import { Client } from "../../../typings";
import { client } from "../lib/client";
import { sanityFetchOptions } from "../lib/fetchOptions";

export const getClients = cache(async (): Promise<Client[]> => {
  const query = groq`*[_type == "client"]{
    _id,
    title,
    image{
      asset->{_id, url},
      alt
    }
  }`;
  return client.fetch<Client[]>(query, {}, sanityFetchOptions);
});
