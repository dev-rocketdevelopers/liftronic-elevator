import { groq } from "next-sanity";
import { Client } from "../../../typings";
import { sanityFetch, SANITY_CACHE_TAGS } from "../lib/cache";

export async function getClients(): Promise<Client[]> {
  const query = groq`*[_type == "client"]{
    _id,
    title,
    image{
      asset->{_id, url},
      alt
    }
  }`;
  return sanityFetch<Client[]>({
    query,
    tags: [SANITY_CACHE_TAGS.home],
  });
}
