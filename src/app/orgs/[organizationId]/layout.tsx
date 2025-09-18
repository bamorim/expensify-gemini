import { auth } from "~/server/auth";
import OrgScopedShell from "~/app/_components/OrgScopedShell";

export default async function OrgLayout({
  children,
}: { 
  children: React.ReactNode;
}) {
  const session = await auth();

  return <OrgScopedShell session={session}>{children}</OrgScopedShell>;
}
