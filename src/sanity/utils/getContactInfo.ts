import { groq } from "next-sanity";
import { cache } from "react";
import { ContactInfo } from "../../../typings";
import { client } from "../lib/client";

export const getContactInfo = cache(async (): Promise<ContactInfo | null> => {
  const query = groq`*[_type == "contactInfo"][0]{
    _id,
    supportPhone,
    supportPhoneLabel,
    email,
    emailLabel,
    salesPhone,
    salesPhoneLabel,
    mapEmbedUrl,
    addresses[]{
      _key,
      label,
      address
    },
    whatsappNumber,
    whatsappMessage,
    privacyPolicyUrl,
    termsOfServiceUrl
  }`;
  return client.fetch<ContactInfo | null>(
    query,
    {},
    { next: { revalidate: 86400 } },
  );
});
