import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://harbourline-stays.vercel.app";

/** A test site: crawlers are welcome on the rooms, and asked to leave the booking alone. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/account", "/api/", "/book/verify"] }],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
