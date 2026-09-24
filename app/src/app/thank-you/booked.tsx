"use client";

import { useEffect } from "react";

/**
 * The one thing a page tells the snippet: this is what finishing looks like
 * here. Without it a session that booked and one that left the form look the
 * same, and Traffic would have to guess.
 */
declare global {
  interface Window {
    braille?: { conversion?: (name: string) => void };
  }
}

export function Booked() {
  useEffect(() => {
    window.braille?.conversion?.("booking");
  }, []);
  return null;
}
