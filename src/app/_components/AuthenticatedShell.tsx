import type { Session } from "next-auth";
import Link from "next/link";

interface AuthenticatedShellProps {
  session: Session | null;
  children: React.ReactNode;
}

export default function AuthenticatedShell({
  session,
  children,
}: AuthenticatedShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <header className="flex items-center justify-between bg-gray-800 p-4">
        <Link href="/" className="text-2xl font-bold">
          Expensify
        </Link>
        {session?.user && (
          <div className="flex items-center gap-4">
            <span>Hello, {session.user.name ?? session.user.email}</span>
            <Link
              href="/api/auth/signout"
              className="rounded-full bg-white/10 px-4 py-2 font-semibold no-underline transition hover:bg-white/20"
            >
              Sign out
            </Link>
          </div>
        )}
      </header>
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
}
