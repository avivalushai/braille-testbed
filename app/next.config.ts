import type { NextConfig } from "next";

/** A test site: it must never turn up in search results as if it were real. */
const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: [{ key: "X-Content-Type-Options", value: "nosniff" }] }];
  },
};

export default nextConfig;
