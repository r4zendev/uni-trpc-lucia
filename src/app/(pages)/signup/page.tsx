import * as context from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "~/server/auth";

import { SignupForm } from "./_components/form";

export default async function Login() {
  const authRequest = auth.handleRequest("GET", context);
  const session = await authRequest.validate();
  if (session) redirect("/");

  return (
    <>
      <h1>Sign up</h1>

      <SignupForm />
    </>
  );
}
