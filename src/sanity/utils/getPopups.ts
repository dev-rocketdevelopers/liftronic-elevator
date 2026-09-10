import { groq } from "next-sanity";
import type { PopupModel } from "~/sanity/lib/popupTypes";
import { sanityFetch, SANITY_CACHE_TAGS } from "~/sanity/lib/cache";

const popupsQuery = groq`*[_type == "popup" && isActive == true] | order(order asc, _createdAt asc) {
  _id,
  name,
  popupType,
  triggerMode,
  order,
  isActive,
  delaySeconds,
  showOncePerSession,
  waitForPrevious,
  teaserConfig {
    title,
    description,
    videoUrl
  },
  requestQuoteConfig {
    title,
    subtitle
  }
}`;

export async function getPopups(): Promise<PopupModel[]> {
  const popups = await sanityFetch<PopupModel[]>({
    query: popupsQuery,
    tags: [SANITY_CACHE_TAGS.popups],
  });
  return popups ?? [];
}
