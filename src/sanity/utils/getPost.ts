import { groq } from "next-sanity";
import { Post } from "../../../typings";
import {
  sanityFetch,
  SANITY_CACHE_TAGS,
  SANITY_DETAIL_TAGS,
} from "../lib/cache";

export async function getPosts(): Promise<Post[]> {
  const query = groq`*[_type == "post"]{
    _id,
    _createdAt,
    title,
    slug,
    author->{_id, name, slug, image{asset->{_id,url}, alt}, bio},
    mainImage{asset->{_id,url}, alt},
    categories[]->{_id, title, slug, description},
    publishedAt,
    body
  }`;

  return sanityFetch<Post[]>({
    query,
    tags: [SANITY_CACHE_TAGS.blogs],
  });
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const query = groq`*[_type == "post" && slug.current == $slug][0]{
    _id,
    _createdAt,
    title,
    slug,
    author->{_id, name, slug, image{asset->{_id,url}, alt}, bio},
    mainImage{asset->{_id,url}, alt},
    categories[]->{_id, title, slug, description},
    publishedAt,
    body
  }`;

  return sanityFetch<Post | null>({
    query,
    params: { slug },
    tags: [SANITY_DETAIL_TAGS.post(slug)],
  });
}
