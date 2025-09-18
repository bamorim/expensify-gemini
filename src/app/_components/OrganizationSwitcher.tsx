"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function OrganizationSwitcher() {
  const router = useRouter();
  const params = useParams();
  const currentOrganizationId = params.organizationId as string;
  const { data: organizations, isLoading } = api.organization.list.useQuery();
  const [isOpen, setIsOpen] = useState(false);

  const handleOrganizationChange = (newOrgId: string) => {
    router.push(`/orgs/${newOrgId}/dashboard`);
    setIsOpen(false);
  };

  if (isLoading) {
    return <span className="text-xl">Loading Orgs...</span>;
  }

  const currentOrg = organizations?.find(
    (orgUser) => orgUser.organization.id === currentOrganizationId,
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-semibold no-underline transition hover:bg-white/20"
      >
        {currentOrg?.organization.name ?? "Select Organization"}
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      {isOpen && (
        <div className="ring-opacity-5 absolute left-0 z-10 mt-2 w-56 rounded-md bg-gray-700 shadow-lg ring-1 ring-black focus:outline-none">
          <div className="py-1">
            {organizations?.map((orgUser) => (
              <button
                key={orgUser.organization.id}
                onClick={() =>
                  handleOrganizationChange(orgUser.organization.id)
                }
                className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-600"
              >
                {orgUser.organization.name}
              </button>
            ))}
            <div className="my-1 border-t border-gray-600"></div>
            <Link
              href="/orgs/new"
              className="block px-4 py-2 text-sm text-blue-300 hover:bg-gray-600"
              onClick={() => setIsOpen(false)}
            >
              + Create New Organization
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
