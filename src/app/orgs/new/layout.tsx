import { auth } from "~/server/auth";
import AuthenticatedShell from "~/app/_components/AuthenticatedShell";

export default async function NewOrgLayout({
  children,
}: { 
  children: React.ReactNode;
}) {
  const session = await auth();

  return <AuthenticatedShell session={session}>{children}</AuthenticatedShell>;
}
