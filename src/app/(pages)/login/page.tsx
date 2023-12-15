import * as context from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "~/server/auth";

import { LoginForm } from "./_components/form";
import { GoogleButton } from "./_components/oauth-btn";

export default async function Login() {
  const authRequest = auth.handleRequest("GET", context);
  const session = await authRequest.validate();
  if (session) redirect("/");

  return (
    <>
      <h1>Log in</h1>

      <LoginForm />

      <GoogleButton />
    </>
  );
}
