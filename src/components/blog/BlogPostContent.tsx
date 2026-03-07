import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "~/components/Breadcrumb";
import CallToActionSection from "~/components/CallToActionSection";
import BlogCard from "~/components/blog/BlogCard";
import PortableTextRenderer from "~/components/blog/PortableTextRenderer";
import type { BlogPostFull } from "~/sanity/lib/blogTypes";

type BlogPostContentProps = {
  post: BlogPostFull;
};

export default function BlogPostContent({ post }: BlogPostContentProps) {
  const heroImage = post.mainImage || "/assets/service_banner.png";
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const authorName = post.author?.name || "Liftronic Team";
  const tagLabel = post.tag || "Insights";
  const readTimeLabel = post.readTime || "";
  const relatedPosts = post.relatedPosts || [];

  return (
    <main className="min-h-screen">
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-white via-white/80 to-gray-50/50">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_farthest-corner_at_top_right,_rgba(42,227,148,0.12),_transparent_60%)]" />
          <div className="absolute -left-20 top-1/3 h-80 w-80 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl opacity-60" />
          <div className="absolute -right-24 bottom-20 h-72 w-72 rounded-full bg-accent/15 blur-3xl opacity-50" />
        </div>

        <div className="container mx-auto px-6 py-16 md:py-28">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blogs" },
              { label: post.title, isCurrentPage: true },
            ]}
          />

          <div className="mt-6 grid items-start gap-16 lg:grid-cols-[1fr_0.85fr] lg:items-center">
            <div className="space-y-8">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 font-semibold text-accent">
                  {tagLabel}
                </span>
                <time dateTime={post.publishedAt}>{formattedDate}</time>
                <span>•</span>
                <span>{readTimeLabel}</span>
                <span>•</span>
                <span>{authorName}</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl font-bold leading-tight text-charcoal md:text-5xl lg:text-6xl">
                  {post.title}
                </h1>
                <p className="text-xl leading-relaxed text-gray-700 md:text-2xl lg:max-w-xl">
                  {post.excerpt}
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                <Link
                  href="/#contact"
                  className="btn btn-primary px-8 py-4 text-lg shadow-lg transition-all duration-300 hover:shadow-xl"
                >
                  Get Expert Consultation
                </Link>
                <Link
                  href="/blogs"
                  className="btn border-2 border-gray-200 bg-white/80 px-8 py-4 text-lg text-charcoal backdrop-blur-sm transition-all duration-300 hover:border-gray-300 hover:bg-gray-50"
                >
                  All Articles
                </Link>
              </div>
            </div>

            <div className="order-first lg:order-last">
              <div className="relative mx-auto aspect-[4/3] w-full overflow-hidden rounded-3xl border border-gray-200/60 bg-white shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-gray-900/5" />
                <Image
                  src={heroImage}
                  alt={post.imageAlt || `${post.title} cover image`}
                  fill
                  sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200/60 bg-white py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="prose prose-lg max-w-none">
            <PortableTextRenderer value={post.body} />
          </div>
        </div>
      </section>

      {relatedPosts.length > 0 && (
        <section className="border-t border-gray-200/60 bg-gradient-to-br from-gray-50/30 to-white py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-16 space-y-6">
              <div className="inline-block rounded-full bg-accent/10 px-4 py-2">
                <span className="text-sm font-bold uppercase tracking-wider text-accent">
                  Continue Reading
                </span>
              </div>
              <h2 className="text-3xl font-bold leading-tight text-charcoal md:text-4xl lg:text-5xl">
                Related articles
              </h2>
              <p className="max-w-2xl text-xl leading-relaxed text-gray-700">
                Explore more insights and expertise from our technical team
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
              {relatedPosts.slice(0, 3).map((relatedPost) => (
                <BlogCard
                  key={relatedPost._id}
                  title={relatedPost.title}
                  excerpt={relatedPost.excerpt}
                  tag={relatedPost.tag}
                  date={new Date(relatedPost.publishedAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    },
                  )}
                  readTime={relatedPost.readTime}
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
      )}

      <CallToActionSection
        secondaryAction={{
          label: "Read More Articles",
          href: "/blogs",
        }}
      />
    </main>
  );
}
