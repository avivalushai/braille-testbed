import type { MetadataRoute } from "next";

import { ROOMS } from "@/rooms";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://harbourline-stays.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const changed = new Date("2026-09-23");
  return [
    { url: SITE, lastModified: changed },
    { url: `${SITE}/rooms`, lastModified: changed },
    ...ROOMS.map((room) => ({ url: `${SITE}/rooms/${room.slug}`, lastModified: changed })),
    { url: `${SITE}/book`, lastModified: changed },
    { url: `${SITE}/signin`, lastModified: changed },
  ];
}
