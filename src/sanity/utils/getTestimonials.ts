// frontend call to get testimonials
import { cache } from "react";
import { Testimonial } from "../../../typings";
import { groq } from "next-sanity";
import { client } from "~/sanity/lib/client";
import { sanityFetchOptions } from "~/sanity/lib/fetchOptions";

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  const query = groq`*[_type == "testimonial"]{
    _id,
    _createdAt,
    testimonialFrom,
    testimonialDetail,
    companyImage{
      asset->{_id, url},
      alt
    }
  }`;

  return client.fetch<Testimonial[]>(query, {}, sanityFetchOptions);
});
