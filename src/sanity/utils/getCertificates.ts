// Utility functions to fetch certificates from Sanity

import { cache } from "react";
import { client } from "../lib/client";
import { sanityFetchOptions } from "../lib/fetchOptions";
import { urlFor } from "../lib/image";
import type { Certificate, CertificateRaw } from "../lib/certificateTypes";

/**
 * Get all certificates ordered by displayOrder
 */
export const getAllCertificates = cache(async (): Promise<Certificate[]> => {
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

    const certificates: CertificateRaw[] = await client.fetch(
      query,
      {},
      sanityFetchOptions,
    );

    return certificates.map((cert) => ({
      ...cert,
      certificateImage: cert.certificateImage
        ? urlFor(cert.certificateImage).width(1200).height(900).url()
        : "",
    }));
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return [];
  }
});

/**
 * Get featured certificates only
 */
export const getFeaturedCertificates = cache(
  async (): Promise<Certificate[]> => {
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

      const certificates: CertificateRaw[] = await client.fetch(
        query,
        {},
        sanityFetchOptions,
      );

      return certificates.map((cert) => ({
      ...cert,
      certificateImage: cert.certificateImage
        ? urlFor(cert.certificateImage).width(1200).height(900).url()
        : "",
      }));
  } catch (error) {
    console.error("Error fetching featured certificates:", error);
    return [];
  }
  },
);

/**
 * Get a specific number of certificates
 * @param limit - Maximum number of certificates to return
 */
export const getCertificates = cache(
  async (limit?: number): Promise<Certificate[]> => {
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

      const certificates: CertificateRaw[] = await client.fetch(
        query,
        {},
        sanityFetchOptions,
      );

      return certificates.map((cert) => ({
      ...cert,
      certificateImage: cert.certificateImage
        ? urlFor(cert.certificateImage).width(1200).height(900).url()
        : "",
      }));
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return [];
  }
  },
);

/**
 * Get a single certificate by ID
 */
export const getCertificateById = cache(
  async (id: string): Promise<Certificate | null> => {
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

      const certificate: CertificateRaw | null = await client.fetch(
        query,
        { id },
        sanityFetchOptions,
      );

      if (!certificate) return null;

      return {
        ...certificate,
        certificateImage: certificate.certificateImage
          ? urlFor(certificate.certificateImage).width(1200).height(900).url()
          : "",
      };
  } catch (error) {
    console.error("Error fetching certificate by ID:", error);
    return null;
  }
  },
);
