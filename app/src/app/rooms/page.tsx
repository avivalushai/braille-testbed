import type { Metadata } from "next";
import Link from "next/link";

import { ROOMS } from "@/rooms";

export const metadata: Metadata = { title: "Rooms", description: "Four invented rooms above the harbour." };

export default function RoomsPage() {
  return (
    <>
      <h1>Rooms</h1>
      <ul className="cards">
        {ROOMS.map((room) => (
          <li key={room.slug}>
            <Link className="card" href={`/rooms/${room.slug}`}>
              <h2>{room.name}</h2>
              <p>
                Sleeps {room.sleeps}. £{room.price} a night.
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
