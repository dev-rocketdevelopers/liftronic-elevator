import type { Metadata } from "next";
import BlogListingContent from "./BlogListingContent";

export const revalidate = 3600;
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Blog - Insights & Knowledge | Lift Solutions",
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
    canonical: "/blogs",
  },
};

export default function BlogPage() {
  return <BlogListingContent currentPage={1} />;
}
