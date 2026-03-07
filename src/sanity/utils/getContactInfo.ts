import { groq } from "next-sanity";
import { cache } from "react";
import { ContactInfo } from "../../../typings";
import { client } from "../lib/client";
import { sanityFetchOptions } from "../lib/fetchOptions";

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
    headquarters,
    whatsappNumber,
    whatsappMessage,
    privacyPolicyUrl,
    termsOfServiceUrl
  }`;
  return client.fetch<ContactInfo | null>(query, {}, sanityFetchOptions);
});
