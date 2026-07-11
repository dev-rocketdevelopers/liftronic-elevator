import { groq } from "next-sanity";
import { client } from "~/sanity/lib/client";
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

export async function getPopups(): Promise<PopupModel[]> {
  const popups = await client.fetch<PopupModel[]>(
    popupsQuery,
    {},
    { next: { revalidate: 86400 } },
  );
  return popups ?? [];
}
