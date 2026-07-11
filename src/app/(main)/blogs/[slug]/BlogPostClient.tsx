"use client";
import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Breadcrumb from "~/components/Breadcrumb";
import BlogCard from "~/components/blog/BlogCard";
import ProductCard from "~/components/products/ProductCard";
import CallToActionSection from "~/components/CallToActionSection";
import PortableTextRenderer from "~/components/blog/PortableTextRenderer";
import type { BlogPostFull } from "~/sanity/lib/blogTypes";

type BlogPostClientProps = {
  post: BlogPostFull;
};

export default function BlogPostClient({ post }: BlogPostClientProps) {
  const router = useRouter();

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/blogs");
  };

  // Prefetch the blog page immediately when this page loads
  useEffect(() => {
    router.prefetch("/blogs");
  }, [router]);

  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const authorName = post.author?.name || "Liftronic Team";
  const tagLabel = post.tag || "Insights";
  const readTimeLabel = post.readTime || "";

  // Get related posts from the post data
  const relatedPosts = post.relatedPosts || [];
  const relatedProducts = post.relatedProducts || [];

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blogs" },
    { label: post.title, isCurrentPage: true },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-white via-white/80 to-gray-50/50">
        {/* Background Elements */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_farthest-corner_at_top_right,_rgba(42,227,148,0.12),_transparent_60%)]" />
          <div className="absolute -left-20 top-1/3 h-80 w-80 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl opacity-60" />
          <div className="absolute -right-24 bottom-20 h-72 w-72 rounded-full bg-accent/15 blur-3xl opacity-50" />
        </div>

        <div className="container mx-auto px-6 py-16 md:py-28">
          <Breadcrumb items={breadcrumbItems} />

          <div
            className={`grid items-start gap-16 ${post.mainImage ? "lg:grid-cols-[1fr_0.85fr]" : ""} lg:items-center mt-6`}
          >
            {/* Content */}
            <div className="space-y-8">
              {/* Meta information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-accent font-semibold">
                  {tagLabel}
                </span>
                <time dateTime={post.publishedAt}>{formattedDate}</time>
                <span>•</span>
                <span>{readTimeLabel}</span>
                <span>•</span>
                <span>{authorName}</span>
              </div>

              {/* Title and Summary */}
              <div className="space-y-4">
                <h1 className="blog-title text-4xl font-bold leading-tight text-charcoal md:text-5xl lg:text-6xl">
                  {post.title}
                </h1>
                <p className="text-xl leading-relaxed text-gray-700 md:text-2xl lg:max-w-xl">
                  {post.excerpt}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                <Link
                  prefetch={false}
                  href="/#contact"
                  className="btn btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Expert Consultation
                </Link>
                <button
                  onClick={handleBackClick}
                  className="btn border-2 border-gray-200 bg-white/80 text-charcoal hover:bg-gray-50 hover:border-gray-300 text-lg px-8 py-4 backdrop-blur-sm transition-all duration-300"
                >
                  All Articles
                </button>
              </div>
            </div>

            {/* Blog Image */}
            {post.mainImage && (
              <div className="order-first lg:order-last">
                <div className="relative mx-auto aspect-[4/3] w-full overflow-hidden rounded-3xl border border-gray-200/60 bg-white shadow-2xl blog-image">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-gray-900/5" />
                  <Image
                    src={post.mainImage}
                    alt={post.imageAlt || `${post.title} cover image`}
                    fill
                    sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="border-t border-gray-200/60 bg-white py-10 md:py-14">
        <div className="container mx-auto px-4">
          <div className="prose prose-lg max-w-none">
            <Suspense
              fallback={
                <div className="space-y-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              }
            >
              <PortableTextRenderer value={post.body} />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <Suspense
          fallback={
            <section className="border-t border-gray-200/60 bg-gradient-to-br from-gray-50/30 to-white py-20 md:py-28">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-200 rounded-xl h-96"></div>
                  ))}
                </div>
              </div>
            </section>
          }
        >
          <section className="border-t border-gray-200/60 bg-gradient-to-br from-gray-50/30 to-white py-20 md:py-28">
            <div className="container mx-auto px-4">
              {/* Section Header */}
              <div className="mx-auto space-y-3 mb-12">
                <div className="inline-block rounded-full bg-accent/10 px-4 py-2">
                  <span className="text-sm font-bold uppercase tracking-wider text-accent">
                    Related Products
                  </span>
                </div>
                <h2 className="text-3xl font-bold leading-tight text-charcoal md:text-4xl lg:text-5xl">
                  Explore our products
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed max-w-2xl">
                  Discover the elevator and escalator solutions mentioned in
                  this article
                </p>
              </div>

              {/* Related Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {relatedProducts.slice(0, 3).map((product) => (
                  <ProductCard
                    key={product._id}
                    title={product.title}
                    summary={product.description}
                    tags={product.tags?.map((tag) => tag.title) || []}
                    productId={product.slug}
                    imageSrc={product.mainImage}
                    imageAlt={product.imageAlt}
                    blurDataURL={product.mainImageLqip}
                  />
                ))}
              </div>
            </div>
          </section>
        </Suspense>
      )}

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <Suspense
          fallback={
            <section className="border-t border-gray-200/60 bg-gradient-to-br from-gray-50/30 to-white py-20 md:py-28">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-200 rounded-xl h-96"></div>
                  ))}
                </div>
              </div>
            </section>
          }
        >
          <section className="border-t border-gray-200/60 bg-gradient-to-br from-gray-50/30 to-white py-20 md:py-28">
            <div className="container mx-auto px-4">
              {/* Section Header */}
              <div className="mx-auto space-y-3 mb-12">
                <div className="inline-block rounded-full bg-accent/10 px-4 py-2">
                  <span className="text-sm font-bold uppercase tracking-wider text-accent">
                    Continue Reading
                  </span>
                </div>
                <h2 className="text-3xl font-bold leading-tight text-charcoal md:text-4xl lg:text-5xl">
                  Related articles
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed max-w-2xl">
                  Explore more insights and expertise from our technical team
                </p>
              </div>

              {/* Related Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {relatedPosts.slice(0, 3).map((relatedPost) => (
                  <BlogCard
                    key={relatedPost._id}
                    title={relatedPost.title}
                    excerpt={relatedPost.excerpt}
                    tag={relatedPost.tag}
                    author={relatedPost.author}
                    blogId={relatedPost.slug}
                    imageSrc={relatedPost.mainImage}
                    imageAlt={relatedPost.imageAlt}
                    blurDataURL={relatedPost.mainImageLqip}
                  />
                ))}
              </div>
            </div>
          </section>
        </Suspense>
      )}

      <CallToActionSection
        secondaryAction={{
          label: "Read More Articles",
          onClick: handleBackClick,
        }}
      />
    </main>
  );
}
