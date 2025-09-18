'use client';

import { useState } from "react";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";

export default function OrgInvitationsPage() {
  const params = useParams();
  const organizationId = params.organizationId as string;
  const utils = api.useUtils();

  const [emailToInvite, setEmailToInvite] = useState("");

  const { data: invitations, isLoading: isLoadingInvitations } = api.invitation.list.useQuery({
    organizationId: organizationId,
  });

  const createInvitation = api.invitation.create.useMutation({
    onSuccess: () => {
      void utils.invitation.list.invalidate({ organizationId: organizationId });
      setEmailToInvite("");
    },
  });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    createInvitation.mutate({ email: emailToInvite, organizationId: organizationId });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-12 px-4 py-16">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        Organization Invitations
      </h1>
      <p className="text-2xl text-white text-center">
        Organization ID: {organizationId}
      </p>

      <div className="flex w-full max-w-md flex-col gap-4">
        <h2 className="text-3xl font-bold">Invite users</h2>
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
    </div>
  );
}
