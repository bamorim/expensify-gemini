'use client';

import { useEffect } from 'react';
import { api } from '~/trpc/react';
import { useParams } from 'next/navigation';

export default function AcceptInvitationPage() {
  const params = useParams();
  const token = params.token as string;
  const acceptInvitation = api.invitation.accept.useMutation();

  useEffect(() => {
    if (token) {
      acceptInvitation.mutate({ token });
    }
  }, [token]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Accept Invitation
        </h1>
        {acceptInvitation.isPending && <p>Accepting invitation...</p>}
        {acceptInvitation.isSuccess && (
          <div>
            <p className="text-2xl text-green-500">
              Invitation accepted successfully!
            </p>
            <p>You are now a member of {acceptInvitation.data?.name}.</p>
          </div>
        )}
        {acceptInvitation.error && (
          <p className="text-2xl text-red-500">
            Error: {acceptInvitation.error.message}
          </p>
        )}
      </div>
    </main>
  );
}
