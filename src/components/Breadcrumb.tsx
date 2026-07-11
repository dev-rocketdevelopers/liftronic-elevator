import Link from "next/link";
import { HiChevronRight, HiHome } from "react-icons/hi";

type BreadcrumbItem = {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
};

type BreadcrumbProps = {
  title?: string;
  items?: BreadcrumbItem[];
};

export default function Breadcrumb({ title, items }: BreadcrumbProps) {
  // Default breadcrumb structure
  const defaultItems: BreadcrumbItem[] = [{ label: "Home", href: "/" }];

  // If title is provided, add it as the final item
  if (title) {
    defaultItems.push({
      label: title,
      isCurrentPage: true,
    });
  }

  // Use custom items if provided, otherwise use default
  const breadcrumbItems = items || defaultItems;

  return (
    <div className="mt-20 md:mt-0">
      <div className="container">
        <nav aria-label="Breadcrumb">
          <ol
            itemScope
            itemType="https://schema.org/BreadcrumbList"
            className="flex items-center gap-2 text-sm"
          >
            <li
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <Link
                prefetch={false}
                itemProp="item"
                href="/"
                className="flex items-center gap-1.5 text-gray-600 transition-colors hover:text-accent"
              >
                <HiHome className="h-4 w-4" aria-hidden="true" />
                <span itemProp="name">Home</span>
              </Link>
              <meta itemProp="position" content="1" />
            </li>

            {breadcrumbItems.slice(1).map((item, index) => (
              <li
                key={index}
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
                className="flex items-center gap-2"
              >
                <HiChevronRight
                  className="h-4 w-4 text-gray-400"
                  aria-hidden="true"
                />
                {item.href && !item.isCurrentPage ? (
                  <>
                    <Link
                      prefetch={false}
                      itemProp="item"
                      href={item.href}
                      className="font-medium text-gray-600 transition-colors hover:text-accent"
                    >
                      <span itemProp="name">{item.label}</span>
                    </Link>
                    <meta itemProp="position" content={String(index + 2)} />
                  </>
                ) : (
                  <>
                    <span
                      itemProp="name"
                      className={`max-w-[200px] truncate ${
                        item.isCurrentPage
                          ? "font-semibold text-accent"
                          : "font-medium text-gray-600"
                      }`}
                      aria-current={item.isCurrentPage ? "page" : undefined}
                    >
                      {item.label}
                    </span>
                    <meta itemProp="position" content={String(index + 2)} />
                  </>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}
