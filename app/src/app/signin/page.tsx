import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign in", description: "Sign in to finish a booking on this test site. Any name works." };

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next = "/book", error } = await searchParams;
  return (
    <>
      <h1>Sign in</h1>
      <p className="note">A test site: any name and any password are accepted, and neither is stored.</p>
      {error ? <p className="error">Enter a name to continue.</p> : null}
      <form method="post" action="/api/signin">
        <input type="hidden" name="next" value={next} />
        <label>
          Name
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          Password
          <input name="password" type="password" autoComplete="current-password" />
        </label>
        <button type="submit">Sign in</button>
      </form>
    </>
  );
}
