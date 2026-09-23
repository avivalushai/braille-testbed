import Link from "next/link";

import { ROOMS } from "@/rooms";

export default function Home() {
  return (
    <>
      <h1>Rooms above the harbour</h1>
      <p>Four invented rooms in an invented town. This site takes no bookings; it exists so AI agents have a task to try.</p>
      <ul className="cards">
        {ROOMS.slice(0, 3).map((room) => (
          <li key={room.slug}>
            <Link className="card" href={`/rooms/${room.slug}`}>
              <h2>{room.name}</h2>
              <p>
                {room.summary} £{room.price} a night.
              </p>
            </Link>
          </li>
        ))}
      </ul>
      <p>
        <Link href="/rooms">Every room</Link> or <Link href="/book">book one</Link>.
      </p>
    </>
  );
}
