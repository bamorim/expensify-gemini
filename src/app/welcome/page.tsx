import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";
import AuthenticatedShell from "~/app/_components/AuthenticatedShell";

export default async function WelcomePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const organizations = await api.organization.list();

  if (organizations && organizations.length > 0) {
    redirect(`/orgs/${organizations[0]?.organization.id}/dashboard`);
  }

  return (
    <AuthenticatedShell session={session}>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          No Organization Found
        </h1>
        <p className="text-2xl text-white text-center">
          It looks like you don&apos;t belong to any organization yet.
        </p>
        <div className="flex flex-col items-center gap-4">
          <Link
            href="/orgs/new"
            className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
          >
            Create New Organization
          </Link>
          <p className="text-lg text-white text-center">
            Alternatively, you can join an existing organization by invitation.
          </p>
        </div>
      </div>
    </AuthenticatedShell>
  );
}
