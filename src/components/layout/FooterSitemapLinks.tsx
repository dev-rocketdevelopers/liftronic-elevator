import Link from "next/link";
import { client } from "~/sanity/lib/client";
import { groq } from "next-sanity";

interface SitemapItem {
  title: string;
  slug: string;
}

async function getAllSitemapLinks() {
  const [productRanges, services, blogs] = await Promise.all([
    client.fetch<SitemapItem[]>(
      groq`*[_type == "productRange" && defined(slug.current)] | order(featured desc, order asc, title asc) {
        title,
        "slug": slug.current
      }`,
      {},
      { next: { revalidate: 86400 } }, // 24 hour cache
    ),
    client.fetch<SitemapItem[]>(
      groq`*[_type == "service" && defined(slug.current)] | order(title asc) {
        title,
        "slug": slug.current
      }`,
      {},
      { next: { revalidate: 86400 } },
    ),
    client.fetch<SitemapItem[]>(
      groq`*[_type == "post" && defined(slug.current)] | order(_createdAt desc)[0...10] {
        title,
        "slug": slug.current
      }`,
      {},
      { next: { revalidate: 86400 } },
    ),
  ]);

  return {
    main: [
      { title: "Home", slug: "/" },
      { title: "About Us", slug: "/aboutus" },
      { title: "Contact", slug: "/contact" },
      { title: "Services", slug: "/services" },
      { title: "Products", slug: "/products" },
      { title: "Blog", slug: "/blogs" },
      { title: "Media", slug: "/media" },
    ],
    productRanges,
    services,
    blogs,
  };
}

export default async function FooterSitemapLinks() {
  const links = await getAllSitemapLinks();

  return (
    <section className="bg-soft py-8 border-t border-gray-200">
      <div className="container mx-auto">
        <div className="space-y-4">
          {/* Main Pages */}
          <div className="flex items-center">
            <h3 className="text-accent font-semibold text-sm w-24 shrink-0 mr-4">
              Main Pages
            </h3>
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {links.main.map((link) => (
                <li key={link.slug}>
                  <Link
                    prefetch={false}
                    href={link.slug}
                    className="text-gray-700 hover:text-accent transition-colors text-xs"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Ranges */}
          <div className="flex items-center">
            <h3 className="text-accent font-semibold text-sm w-24 shrink-0 mr-4">
              Product Ranges
            </h3>
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {links.productRanges.length > 0 ? (
                links.productRanges.map((link) => (
                  <li key={link.slug}>
                    <Link
                      prefetch={false}
                      href={`/products#${link.slug}`}
                      className="text-gray-700 hover:text-accent transition-colors text-xs"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-xs">
                  No product ranges available
                </li>
              )}
            </ul>
          </div>

          {/* Services */}
          <div className="flex items-center">
            <h3 className="text-accent font-semibold text-sm w-24 shrink-0 mr-4">
              Services
            </h3>
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {links.services.length > 0 ? (
                links.services.map((link) => (
                  <li key={link.slug}>
                    <Link
                      prefetch={false}
                      href={`/services/${link.slug}`}
                      className="text-gray-700 hover:text-accent transition-colors text-xs"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-xs">No services available</li>
              )}
            </ul>
          </div>

          {/* Recent Content */}
          <div className="flex items-center">
            <h3 className="text-accent font-semibold text-sm w-24 shrink-0 mr-4">
              Recent Content
            </h3>
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {links.blogs.length > 0 ? (
                links.blogs.map((link) => (
                  <li key={link.slug}>
                    <Link
                      prefetch={false}
                      href={`/blogs/${link.slug}`}
                      className="text-gray-700 hover:text-accent transition-colors text-xs"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-xs">
                  No blog posts available
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
