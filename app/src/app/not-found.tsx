import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <h1>No such page</h1>
      <p>
        There is no page at that address. <Link href="/rooms">The rooms</Link> are still here.
      </p>
    </>
  );
}
