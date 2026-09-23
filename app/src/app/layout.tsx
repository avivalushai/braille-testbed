import type { Metadata } from "next";
import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Harbourline Stays", template: "%s · Harbourline Stays" },
  description: "An invented booking site, used to test AI traffic capture. Nothing here is real and no booking is taken.",
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
