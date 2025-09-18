'use client';

import { useState } from "react";
import { api } from "~/trpc/react";

function OrganizationItem({ orgUser }: { orgUser: { organization: { id: string; name: string }; role: string } }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(orgUser.organization.name);
  const [emailToInvite, setEmailToInvite] = useState("");
  const utils = api.useUtils();

  const { data: invitations, isLoading: isLoadingInvitations } = api.invitation.list.useQuery({
    organizationId: orgUser.organization.id,
  }, {
    enabled: orgUser.role === "ADMIN",
  });

  const updateOrganization = api.organization.update.useMutation({
    onSuccess: () => {
      utils.organization.list.invalidate();
      setIsEditing(false);
    },
  });

  const deleteOrganization = api.organization.delete.useMutation({
    onSuccess: () => {
      utils.organization.list.invalidate();
    },
  });

  const createInvitation = api.invitation.create.useMutation({
    onSuccess: () => {
      utils.invitation.list.invalidate({ organizationId: orgUser.organization.id });
      setEmailToInvite("");
    },
  });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrganization.mutate({ id: orgUser.organization.id, name });
  };

  const handleDelete = () => {
    deleteOrganization.mutate({ id: orgUser.organization.id });
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    createInvitation.mutate({ email: emailToInvite, organizationId: orgUser.organization.id });
  };

  return (
    <li className="flex flex-col gap-4 rounded-xl bg-white/10 p-4">
      <div className="flex items-center justify-between">
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
          <>
            <span className="text-xl">{orgUser.organization.name}</span>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-sm">
                {orgUser.role}
              </span>
              {orgUser.role === "ADMIN" && (
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
          </>
        )}
      </div>
      {orgUser.role === "ADMIN" && (
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold">Invite users</h3>
          <form onSubmit={handleInvite} className="flex items-center gap-2">
            <input
              type="email"
              value={emailToInvite}
              onChange={(e) => setEmailToInvite(e.target.value)}
              placeholder="user@example.com"
              className="flex-grow rounded-full bg-white/10 px-4 py-2 text-white"
            />
            <button
              type="submit"
              className="rounded-full bg-green-500 px-4 py-2 font-semibold no-underline transition hover:bg-green-600"
              disabled={createInvitation.isPending}
            >
              {createInvitation.isPending ? "Sending..." : "Send Invite"}
            </button>
          </form>
          {isLoadingInvitations && <p>Loading invitations...</p>}
          {invitations && invitations.length > 0 && (
            <div>
              <h4 className="font-bold">Pending Invitations</h4>
              <ul className="flex flex-col gap-2">
                {invitations.map((invitation) => (
                  <li key={invitation.id} className="text-sm">{invitation.email}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </li>
  );
}


export default function OrganizationsPage() {
  const [name, setName] = useState("");
  const utils = api.useUtils();

  const { data: organizations, isLoading, error } = api.organization.list.useQuery();

  const createOrganization = api.organization.create.useMutation({
    onSuccess: () => {
      utils.organization.list.invalidate();
      setName("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrganization.mutate({ name });
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] py-16 text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Manage Organizations
        </h1>
        <div className="flex w-full max-w-md flex-col gap-4">
          <h2 className="text-3xl font-bold">Create a new Organization</h2>
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

        <div className="flex w-full max-w-md flex-col gap-4">
          {isLoading && <p>Loading organizations...</p>}
          {error && <p>Error fetching organizations: {error.message}</p>}
          {organizations && (
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-3xl font-bold">Your Organizations</h2>
              <ul className="flex w-full flex-col gap-2">
                {organizations.map((orgUser) => (
                  <OrganizationItem key={orgUser.organization.id} orgUser={orgUser} />
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
