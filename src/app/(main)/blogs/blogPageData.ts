import { cache } from "react";
import { client } from "~/sanity/lib/client";
import {
  featuredPostsQuery,
  postsCountQuery,
  postsQuery,
} from "~/sanity/lib/queries";
import type { BlogPost } from "~/sanity/lib/blogTypes";
import { sanityFetchOptions } from "~/sanity/lib/fetchOptions";

export const POSTS_PER_PAGE = 12;

export const getPaginatedPosts = cache(async (page: number): Promise<BlogPost[]> => {
  const start = (page - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;

  return client.fetch(postsQuery, { start, end }, sanityFetchOptions);
});

export const getTotalPostsCount = cache(async (): Promise<number> => {
  return client.fetch(postsCountQuery, {}, sanityFetchOptions);
});

export const getFeaturedPosts = cache(async (): Promise<BlogPost[]> => {
  return client.fetch(featuredPostsQuery, {}, sanityFetchOptions);
});

export const getTotalBlogPages = cache(async (): Promise<number> => {
  const totalPosts = await getTotalPostsCount();
  return Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE));
});

export const getBlogPageParams = cache(async (): Promise<Array<{ page: string }>> => {
  const totalPages = await getTotalBlogPages();

  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({
    page: String(index + 2),
  }));
});
