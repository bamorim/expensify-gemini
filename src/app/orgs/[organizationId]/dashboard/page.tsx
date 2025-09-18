'use client';

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export default function OrgDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const organizationId = params.organizationId as string;
  const utils = api.useUtils();

  const { data: orgData, isLoading: isLoadingOrg } = api.organization.get.useQuery({
    id: organizationId,
  });

  const { data: members, isLoading: isLoadingMembers } = api.organization.listMembers.useQuery({
    organizationId: organizationId,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(orgData?.organization.name ?? "");

  const updateOrganization = api.organization.update.useMutation({
    onSuccess: () => {
      void utils.organization.get.invalidate({ id: organizationId });
      setIsEditing(false);
    },
  });

  const deleteOrganization = api.organization.delete.useMutation({
    onSuccess: () => {
      void utils.organization.list.invalidate();
      router.push("/welcome");
    },
  });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrganization.mutate({ id: organizationId, name });
  };

  const handleDelete = () => {
    deleteOrganization.mutate({ id: organizationId });
  };

  if (isLoadingOrg || isLoadingMembers) {
    return (
      <div className="flex flex-col items-center justify-center gap-12 px-4 py-16">
        <p>Loading organization details...</p>
      </div>
    );
  }

  if (!orgData) {
    return (
      <div className="flex flex-col items-center justify-center gap-12 px-4 py-16">
        <p>Organization not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-12 px-4 py-16">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        {orgData.organization.name} Dashboard
      </h1>
      <p className="text-2xl text-white text-center">
        Organization ID: {organizationId}
      </p>

      <div className="flex w-full max-w-md flex-col gap-4">
        <h2 className="text-3xl font-bold">Organization Details</h2>
        {isEditing ? (
          <form onSubmit={handleUpdate} className="flex w-full items-center gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-grow rounded-full bg-white/10 px-4 py-2 text-white"
            />
            <button
              type="submit"
              className="rounded-full bg-blue-500 px-4 py-2 font-semibold no-underline transition hover:bg-blue-600"
              disabled={updateOrganization.isPending}
            >
              {updateOrganization.isPending ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-full bg-gray-500 px-4 py-2 font-semibold no-underline transition hover:bg-gray-600"
            >
              Cancel
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-between w-full">
            <span className="text-xl">{orgData.organization.name}</span>
            <div className="flex items-center gap-2">
              {orgData.role === "ADMIN" && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="rounded-full bg-blue-500 px-4 py-2 font-semibold no-underline transition hover:bg-blue-600"
                  >
                    Update
                  </button>
                  <button
                    onClick={handleDelete}
                    className="rounded-full bg-red-500 px-4 py-2 font-semibold no-underline transition hover:bg-red-600"
                    disabled={deleteOrganization.isPending}
                  >
                    {deleteOrganization.isPending ? "Deleting..." : "Delete"}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex w-full max-w-md flex-col gap-4">
        <h2 className="text-3xl font-bold">Members</h2>
        {isLoadingMembers && <p>Loading members...</p>}
        {members && members.length > 0 ? (
          <ul className="flex w-full flex-col gap-2">
            {members.map((member) => (
              <li key={member.userId} className="flex items-center justify-between rounded-xl bg-white/10 p-4">
                <span>{member.user.name ?? member.user.email}</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-sm">
                  {member.role}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No members found.</p>
        )}
      </div>
    </div>
  );
}
