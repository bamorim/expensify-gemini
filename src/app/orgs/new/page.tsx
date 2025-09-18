'use client';

import { useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export default function CreateOrganizationPage() {
  const router = useRouter();
  const utils = api.useUtils();
  const [name, setName] = useState("");

  const createOrganization = api.organization.create.useMutation({
    onSuccess: (newOrg) => {
      void utils.organization.list.invalidate();
      router.push(`/orgs/${newOrg.id}/dashboard`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrganization.mutate({ name });
  };

  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        Create New Organization
      </h1>
      <div className="flex w-full max-w-md flex-col gap-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Organization Name"
            className="rounded-full bg-white/10 px-4 py-2 text-white"
          />
          <button
            type="submit"
            className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            disabled={createOrganization.isPending}
          >
            {createOrganization.isPending ? "Creating..." : "Create"}
          </button>
        </form>
        {createOrganization.isSuccess && (
          <p className="text-green-500">
            Organization created successfully!
          </p>
        )}
        {createOrganization.error && (
          <p className="text-red-500">
            Error: {createOrganization.error.message}
          </p>
        )}
      </div>
    </div>
  );
}
