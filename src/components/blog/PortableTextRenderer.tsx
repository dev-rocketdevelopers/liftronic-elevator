import { PortableText, PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "~/sanity/lib/image";
import type { PortableTextBlock } from "sanity";

const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 mt-8 first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 mt-8">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 mt-6">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-semibold text-gray-900 mb-2 mt-4">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-accent pl-4 italic my-6 text-gray-700">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 space-y-2 list-none">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-6 space-y-2 list-decimal list-inside">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="flex items-start">
        <span className="text-accent mr-2 font-bold">•</span>
        <span className="text-gray-700">{children}</span>
      </li>
    ),
    number: ({ children }) => (
      <li className="text-gray-700 ml-4">{children}</li>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-gray-900">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => {
      const href = value?.href || "#";
      const rel = href.startsWith("/") ? undefined : "noreferrer noopener";
      return (
        <a
          href={href}
          rel={rel}
          className="text-accent hover:underline font-medium"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <div className="my-8 rounded-lg overflow-hidden">
          <Image
            src={urlFor(value).url()}
            alt={value.alt || "Blog post image"}
            width={800}
            height={600}
            sizes="(min-width: 1024px) 800px, 100vw"
            className="w-full h-auto"
          />
          {value.alt && (
            <p className="text-sm text-gray-500 text-center mt-2">
              {value.alt}
            </p>
          )}
        </div>
      );
    },
  },
};

type PortableTextRendererProps = {
  value: PortableTextBlock[];
};

export default function PortableTextRenderer({
  value,
}: PortableTextRendererProps) {
  return <PortableText value={value} components={components} />;
}
