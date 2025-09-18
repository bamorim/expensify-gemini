import Link from "next/link";
import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Expensify
          </h1>
          <p className="text-2xl text-white">
            Your ultimate solution for managing expenses with ease.
          </p>
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center justify-center gap-4">
              {session && (
                <p className="text-center text-2xl text-white">
                  Logged in as {session.user?.name}
                </p>
              )}
              <Link
                href={session ? "/welcome" : "/api/auth/signin"}
                className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
              >
                {session ? "Go to App" : "Login"}
              </Link>
              {session && (
                <Link
                  href="/api/auth/signout"
                  className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
                >
                  Sign out
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
