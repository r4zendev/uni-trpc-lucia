import { redirect } from "next/navigation";

import { AuthContextProvider } from "~/lib/context/auth";
import { getServerSession } from "~/lib/utils/session";
import "~/styles/globals.css";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    return redirect("/login");
  }

  return (
    <AuthContextProvider session={session}>{children}</AuthContextProvider>
  );
}
