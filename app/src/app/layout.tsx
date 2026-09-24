import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Harbourline Stays", template: "%s · Harbourline Stays" },
  description: "An invented booking site, used to test AI traffic capture. Nothing here is real and no booking is taken.",
  // Google will not take a sitemap from a site it cannot see you own. Public by design, and it has to stay.
  verification: { google: "_MSWsI9Pb9soJgUsM02nH2Zl9Oma5OP6OlZ0cntaYYs" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header>
          <Link className="brand" href="/">
            Harbourline Stays
          </Link>
          <nav aria-label="Main">
            <Link href="/rooms">Rooms</Link>
            <Link href="/book">Book</Link>
            <Link href="/account">Account</Link>
          </nav>
        </header>
        <main>{children}</main>
        {/* What the edge logger cannot see: clicks, fields, the challenge, and whether a booking finished. */}
        <Script src="https://braille-ai-ebon.vercel.app/traffic.js" strategy="afterInteractive" />
        <footer>
          <p>
            <strong>Test site.</strong> Harbourline Stays is not a real business. It exists to test AI traffic capture for Braille AI: no room exists, no
            booking is taken, and no payment is possible.
          </p>
        </footer>
      </body>
    </html>
  );
}
