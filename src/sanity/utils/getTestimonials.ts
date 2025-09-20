// frontend call to get testimonials
import { Testimonial } from "../../../typings";
import { groq } from "next-sanity";
import { client } from "~/sanity/lib/client";

export async function getTestimonials(): Promise<Testimonial[]> {
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

  return client.fetch<Testimonial[]>(query);
}
