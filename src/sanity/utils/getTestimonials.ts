// frontend call to get testimonials
import { Testimonial } from "../../../typings";
import { groq } from "next-sanity";
import { sanityFetch, SANITY_CACHE_TAGS } from "~/sanity/lib/cache";

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

  return sanityFetch<Testimonial[]>({
    query,
    tags: [SANITY_CACHE_TAGS.home],
  });
}
