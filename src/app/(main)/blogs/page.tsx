import * as motion from "motion/react-client";
import Link from "next/link";
import type { Metadata } from "next";
import BlogCard from "~/components/blog/BlogCard";
import FeaturedBlogCard from "~/components/blog/FeaturedBlogCard";
import Breadcrumb from "~/components/Breadcrumb";
import CallToActionSection from "~/components/CallToActionSection";
import { FiEye, FiMessageSquare } from "react-icons/fi";
import { sanityFetch, SANITY_CACHE_TAGS } from "~/sanity/lib/cache";
import {
  postsQuery,
  featuredPostsQuery,
  postsCountQuery,
} from "~/sanity/lib/queries";
import type { BlogPost } from "~/sanity/lib/blogTypes";

const POSTS_PER_PAGE = 12;

type Props = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  return {
    title:
      page === 1
        ? "Blog - Insights & Knowledge | Lift Solutions"
        : `Blog - Page ${page} | Lift Solutions`,
    description:
      "Practical insights, technical guides, and industry perspectives on elevator technology, maintenance, and modernization from our expert team.",
    openGraph: {
      title: "Elevating industry expertise - Blog",
      description:
        "Practical insights, technical guides, and industry perspectives on elevator technology, maintenance, and modernization.",
      type: "website",
      url: "/blogs",
    },
    twitter: {
      card: "summary_large_image",
      title: "Blog - Insights & Knowledge | Lift Solutions",
      description:
        "Practical insights, technical guides, and industry perspectives on elevator technology, maintenance, and modernization.",
    },
    alternates: {
      canonical: page === 1 ? "/blogs" : `/blogs?page=${page}`,
    },
  };
}

async function getPaginatedPosts(page: number): Promise<BlogPost[]> {
  const start = (page - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;
  return sanityFetch<BlogPost[]>({
    query: postsQuery,
    params: { start, end },
    tags: [SANITY_CACHE_TAGS.blogs],
  });
}

async function getTotalPostsCount(): Promise<number> {
  return sanityFetch<number>({
    query: postsCountQuery,
    tags: [SANITY_CACHE_TAGS.blogs],
  });
}

async function getFeaturedPosts(): Promise<BlogPost[]> {
  return sanityFetch<BlogPost[]>({
    query: featuredPostsQuery,
    tags: [SANITY_CACHE_TAGS.blogs],
  });
}

export const revalidate = 604800;
export const dynamicParams = true;

export default async function BlogPage({ searchParams }: Props) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  const [allPosts, totalPosts, featuredPosts] = await Promise.all([
    getPaginatedPosts(currentPage),
    getTotalPostsCount(),
    getFeaturedPosts(),
  ]);

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Blog", isCurrentPage: true },
  ];

  return (
    <main>
      {/* Page hero */}
      <section className="relative">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover opacity-10 sm:bg-cover bg-no-repeat bg-right md:opacity-60"
          style={{
            backgroundImage: "url(/illustrations/lift03.png)",
          }}
        />

        {/* Content overlay */}
        <div className="relative z-10 container mx-auto px-6 py-16 md:pt-28 md:pb-20">
          <Breadcrumb items={breadcrumbItems} />

          <div className="max-w-3xl mt-10">
            <p className="text-sm font-semibold tracking-wide text-gray-500">
              Insights & Knowledge
            </p>
            <h1 className="mt-2 text-4xl md:text-5xl font-extrabold tracking-tight">
              Elevating industry expertise
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Practical insights, technical guides, and industry perspectives on
              elevator technology, maintenance, and modernization from our
              expert team.
            </p>
            <div className="mt-6 flex gap-3">
              <Link prefetch={false} href="/#contact">
                <motion.button
                  className="btn btn-primary px-4 py-2 text-sm md:px-8 md:py-3 md:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiMessageSquare className="text-sm md:text-base" />
                  Get Expert Consultation
                </motion.button>
              </Link>
              <Link prefetch={false} href="/services">
                <motion.button
                  className="btn border-2 border-gray-200 bg-white/80 text-charcoal hover:bg-gray-50 hover:border-gray-300 backdrop-blur-sm transition-all duration-300 px-4 py-2 text-sm md:px-8 md:py-3 md:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiEye className="text-sm md:text-base" />
                  View Services
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-gray-50/30 to-white">
        <div className="container mx-auto px-4">
          <div className="mb-4">
            <div className="inline-block rounded-full bg-accent/10 px-4 py-2 mb-4">
              <span className="text-sm font-bold uppercase tracking-wider text-accent">
                Featured Articles
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Latest insights and expertise
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {featuredPosts.slice(0, 2).map((post) => (
              <FeaturedBlogCard
                key={post._id}
                title={post.title}
                excerpt={post.excerpt}
                tag={post.tag}
                date={new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
                readTime={post.readTime}
                author={post.author}
                blogId={post.slug}
                imageSrc={post.mainImage}
                imageAlt={post.imageAlt}
                blurDataURL={post.mainImageLqip}
              />
            ))}
          </div>
        </div>
      </section>

      {/* All Posts Grid */}
      <section className="py-12 md:py-16 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              All articles
            </h2>
            <p className="mt-2 text-gray-600">
              Browse our complete collection of technical guides and industry
              insights ({totalPosts} articles)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {allPosts.map((post) => (
              <BlogCard
                key={post._id}
                title={post.title}
                excerpt={post.excerpt}
                tag={post.tag}
                author={post.author}
                blogId={post.slug}
                imageSrc={post.mainImage}
                imageAlt={post.imageAlt}
                blurDataURL={post.mainImageLqip}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              {hasPrevPage && (
                <Link
                  prefetch={false}
                  href={
                    currentPage === 2
                      ? "/blogs"
                      : `/blogs?page=${currentPage - 1}`
                  }
                  className="btn border-2 border-gray-200 bg-white text-charcoal hover:bg-gray-50 hover:border-gray-300 px-6 py-2"
                >
                  Previous
                </Link>
              )}

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Link
                      prefetch={false}
                      key={pageNum}
                      href={pageNum === 1 ? "/blogs" : `/blogs?page=${pageNum}`}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        pageNum === currentPage
                          ? "bg-accent text-charcoal"
                          : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                })}
              </div>

              {hasNextPage && (
                <Link
                  prefetch={false}
                  href={`/blogs?page=${currentPage + 1}`}
                  className="btn border-2 border-gray-200 bg-white text-charcoal hover:bg-gray-50 hover:border-gray-300 px-6 py-2"
                >
                  Next
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      <CallToActionSection />
    </main>
  );
}
