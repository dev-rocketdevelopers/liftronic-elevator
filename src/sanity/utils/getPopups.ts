import { groq } from "next-sanity";
import { cache } from "react";
import { client } from "~/sanity/lib/client";
import { sanityFetchOptions } from "~/sanity/lib/fetchOptions";
import type { PopupModel } from "~/sanity/lib/popupTypes";

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

export const getPopups = cache(async (): Promise<PopupModel[]> => {
  const popups = await client.fetch<PopupModel[]>(
    popupsQuery,
    {},
    sanityFetchOptions,
  );
  return popups ?? [];
});
