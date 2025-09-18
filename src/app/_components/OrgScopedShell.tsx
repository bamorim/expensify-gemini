'use client';

import type { Session } from "next-auth";
import Link from "next/link";
import { useParams } from "next/navigation";
import OrganizationSwitcher from "./OrganizationSwitcher";
import { OrganizationProvider } from "./OrganizationContext";
import { api } from "~/trpc/react";

interface OrgScopedShellProps {
  session: Session | null;
  children: React.ReactNode;
}

export default function OrgScopedShell({
  session,
  children,
}: OrgScopedShellProps) {
  const params = useParams();
  const organizationId = params.organizationId;

  if (typeof organizationId !== "string") {
    return <div>Invalid organization ID.</div>;
  }

  const { data: orgData, isLoading: isLoadingOrg } =
    api.organization.get.useQuery({
      id: organizationId,
    });

  if (isLoadingOrg) {
    return <div>Loading organization...</div>;
  }

  if (!orgData) {
    return <div>Organization not found.</div>;
  }

  return (
    <OrganizationProvider orgData={orgData}>
      <div className="flex min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-700 p-4">
          <h2 className="mb-4 text-2xl font-bold">{orgData.organization?.name}</h2>
          <nav>
            <ul>
              <li className="mb-2">
                <Link
                  href={`/orgs/${organizationId}/dashboard`}
                  className="hover:text-gray-300"
                >
                  Dashboard
                </Link>
              </li>
              {orgData.role === "ADMIN" && (
                <li className="mb-2">
                  <Link
                    href={`/orgs/${organizationId}/invitations`}
                    className="hover:text-gray-300"
                  >
                    Invitations
                  </Link>
                </li>
              )}
              {orgData.role === "ADMIN" && (
                <li className="mb-2">
                  <Link
                    href={`/orgs/${organizationId}/categories`}
                    className="hover:text-gray-300"
                  >
                    Categories
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex flex-1 flex-col">
          <header className="flex items-center justify-between bg-gray-800 p-4">
            {/* Organization Switcher */}
            <OrganizationSwitcher />

            {/* User Menu */}
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
          <main className="container mx-auto flex-1 p-4">{children}</main>
        </div>
      </div>
    </OrganizationProvider>
  );
}
