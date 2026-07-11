"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { HiArrowRight } from "react-icons/hi";

type BlogCardProps = {
  title: string;
  excerpt: string;
  tag: string;
  author: string;
  blogId?: string;
  href?: string;
  imageSrc?: string;
  imageAlt?: string;
  blurDataURL?: string;
};

export default function BlogCard({
  title,
  excerpt,
  tag,
  author,
  blogId,
  href,
  imageSrc,
  imageAlt,
  blurDataURL,
}: BlogCardProps) {
  const blogHref = href || (blogId ? `/blogs/${blogId}` : "#");

  // Use the specified blog image or fallback to placeholder
  const finalImageSrc = imageSrc || "/assets/service_banner.png";

  // Better alt text for SEO
  const finalImageAlt = imageAlt || `${title} - Blog post cover image`;

  return (
    <Link
      prefetch={false}
      href={blogHref}
      aria-label={`Read article: ${title}`}
    >
      <article
        itemScope
        itemType="https://schema.org/BlogPosting"
        className="group relative overflow-hidden rounded-xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full cursor-pointer"
      >
        <meta itemProp="headline" content={title} />
        <meta itemProp="description" content={excerpt} />
        <meta itemProp="author" content={author} />
        {/* Image Container */}
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 ${
            blogId ? "blog-image" : ""
          } aspect-[5/3]`}
        >
          <Image
            src={finalImageSrc}
            alt={finalImageAlt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1280px) 400px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            placeholder={blurDataURL ? "blur" : "empty"}
            blurDataURL={blurDataURL}
            loading="lazy"
            itemProp="image"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

          {/* Tag overlay - only show if tag exists */}
          {tag && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm border border-white/20">
                {tag}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <div className="flex-grow">
            {/* Title */}
            <h3
              itemProp="headline"
              className={`font-semibold text-gray-900 tracking-tight leading-tight group-hover:text-gray-800 transition-colors ${
                blogId ? "blog-title" : ""
              } text-lg mb-2`}
            >
              {title}
            </h3>

            {/* Excerpt */}
            <p className="text-gray-600 leading-relaxed text-sm line-clamp-3">
              {excerpt}
            </p>
          </div>

          {/* Action area */}
          <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100 flex-shrink-0">
            <span className="inline-flex items-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-black transition-all hover:bg-accent/90 hover:shadow-sm">
              Read Article
            </span>

            <span className="inline-flex items-center text-sm font-medium text-gray-500 transition-all hover:text-accent group-hover:translate-x-1">
              Continue reading
              <HiArrowRight className="ml-1 h-4 w-4" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
