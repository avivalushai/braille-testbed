import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ROOMS, roomBySlug } from "@/rooms";

export function generateStaticParams() {
  return ROOMS.map((room) => ({ slug: room.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const room = roomBySlug((await params).slug);
  return room ? { title: room.name, description: room.summary } : { title: "Room not found" };
}

export default async function RoomPage({ params }: { params: Promise<{ slug: string }> }) {
  const room = roomBySlug((await params).slug);
  if (!room) notFound();
  return (
    <>
      <h1>{room.name}</h1>
      <p>{room.detail}</p>
      <p className="note">
        Sleeps {room.sleeps}. £{room.price} a night, invented.
      </p>
      <p>
        <Link href={`/book?room=${room.slug}`}>Book this room</Link> · <Link href="/rooms">All rooms</Link>
      </p>
    </>
  );
}
