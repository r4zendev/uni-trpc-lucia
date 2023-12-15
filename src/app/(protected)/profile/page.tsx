import * as context from "next/headers";
import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { auth } from "~/server/auth";

export default async function Profile() {
  const authRequest = auth.handleRequest("GET", context);
  const session = await authRequest.validate();
  if (!session) redirect("/login");

  return (
    <>
      <h1>Profile</h1>

      <Card>
        <CardContent>
          <CardHeader>
            <CardTitle>Your user profile</CardTitle>
          </CardHeader>

          <p>User id: {session.user.userId}</p>
          <p>Email: {session.user.email}</p>
        </CardContent>
      </Card>
    </>
  );
}
