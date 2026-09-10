// Utility functions to fetch certificates from Sanity

import { urlFor } from "../lib/image";
import type { Certificate, CertificateRaw } from "../lib/certificateTypes";
import { sanityFetch, SANITY_CACHE_TAGS } from "../lib/cache";

/**
 * Get all certificates ordered by displayOrder
 */
export async function getAllCertificates(): Promise<Certificate[]> {
  try {
    const query = `*[_type == "certificate"] | order(displayOrder asc) {
      _id,
      _type,
      title,
      issuer,
      issueDate,
      certificateImage,
      imageAlt,
      description,
      displayOrder,
      isFeatured
    }`;

    const certificates = await sanityFetch<CertificateRaw[]>({
      query,
      tags: [SANITY_CACHE_TAGS.about, SANITY_CACHE_TAGS.certificates],
    });

    return certificates.map((cert) => ({
      ...cert,
      certificateImage: cert.certificateImage
        ? urlFor(cert.certificateImage).url()
        : "",
    }));
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return [];
  }
}

/**
 * Get featured certificates only
 */
export async function getFeaturedCertificates(): Promise<Certificate[]> {
  try {
    const query = `*[_type == "certificate" && isFeatured == true] | order(displayOrder asc) {
      _id,
      _type,
      title,
      issuer,
      issueDate,
      certificateImage,
      imageAlt,
      description,
      displayOrder,
      isFeatured
    }`;

    const certificates = await sanityFetch<CertificateRaw[]>({
      query,
      tags: [SANITY_CACHE_TAGS.about, SANITY_CACHE_TAGS.certificates],
    });

    return certificates.map((cert) => ({
      ...cert,
      certificateImage: cert.certificateImage
        ? urlFor(cert.certificateImage).url()
        : "",
    }));
  } catch (error) {
    console.error("Error fetching featured certificates:", error);
    return [];
  }
}

/**
 * Get a specific number of certificates
 * @param limit - Maximum number of certificates to return
 */
export async function getCertificates(limit?: number): Promise<Certificate[]> {
  try {
    const limitClause = limit ? `[0...${limit}]` : "";
    const query = `*[_type == "certificate"] | order(displayOrder asc) ${limitClause} {
      _id,
      _type,
      title,
      issuer,
      issueDate,
      certificateImage,
      imageAlt,
      description,
      displayOrder,
      isFeatured
    }`;

    const certificates = await sanityFetch<CertificateRaw[]>({
      query,
      tags: [SANITY_CACHE_TAGS.about, SANITY_CACHE_TAGS.certificates],
    });

    return certificates.map((cert) => ({
      ...cert,
      certificateImage: cert.certificateImage
        ? urlFor(cert.certificateImage).url()
        : "",
    }));
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return [];
  }
}

/**
 * Get a single certificate by ID
 */
export async function getCertificateById(
  id: string,
): Promise<Certificate | null> {
  try {
    const query = `*[_type == "certificate" && _id == $id][0] {
      _id,
      _type,
      title,
      issuer,
      issueDate,
      certificateImage,
      imageAlt,
      description,
      displayOrder,
      isFeatured
    }`;

    const certificate = await sanityFetch<CertificateRaw | null>({
      query,
      params: { id },
      tags: [SANITY_CACHE_TAGS.about, SANITY_CACHE_TAGS.certificates],
    });

    if (!certificate) return null;

    return {
      ...certificate,
      certificateImage: certificate.certificateImage
        ? urlFor(certificate.certificateImage).url()
        : "",
    };
  } catch (error) {
    console.error("Error fetching certificate by ID:", error);
    return null;
  }
}
