import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogListingContent from "../../BlogListingContent";
import {
  getBlogPageParams,
  getTotalBlogPages,
} from "../../blogPageData";

type Props = {
  params: Promise<{
    page: string;
  }>;
};

const getPageNumber = (page: string): number | null => {
  const pageNumber = Number(page);
  return Number.isInteger(pageNumber) && pageNumber > 1 ? pageNumber : null;
};

export const revalidate = 3600;
export const dynamicParams = false;

export async function generateStaticParams() {
  return getBlogPageParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page } = await params;
  const pageNumber = getPageNumber(page);

  if (!pageNumber) {
    return {
      title: "Blog - Insights & Knowledge | Lift Solutions",
    };
  }

  return {
    title: `Blog - Page ${pageNumber} | Lift Solutions`,
    description:
      "Practical insights, technical guides, and industry perspectives on elevator technology, maintenance, and modernization from our expert team.",
    openGraph: {
      title: `Elevating industry expertise - Blog Page ${pageNumber}`,
      description:
        "Practical insights, technical guides, and industry perspectives on elevator technology, maintenance, and modernization.",
      type: "website",
      url: `/blogs/page/${pageNumber}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `Blog - Page ${pageNumber} | Lift Solutions`,
      description:
        "Practical insights, technical guides, and industry perspectives on elevator technology, maintenance, and modernization.",
    },
    alternates: {
      canonical: `/blogs/page/${pageNumber}`,
    },
  };
}

export default async function BlogPaginationPage({ params }: Props) {
  const { page } = await params;
  const pageNumber = getPageNumber(page);

  if (!pageNumber) {
    notFound();
  }

  const totalPages = await getTotalBlogPages();
  if (pageNumber > totalPages) {
    notFound();
  }

  return <BlogListingContent currentPage={pageNumber} />;
}
