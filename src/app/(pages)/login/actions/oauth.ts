"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { googleAuth } from "~/server/auth";

export async function setGoogleCookie() {
  const [url, state] = await googleAuth.getAuthorizationUrl();

  cookies().set("google_oauth_state", state, {
    path: "/",
    httpOnly: true, // only readable in the server
    maxAge: 60 * 60, // a reasonable expiration date
  });

  redirect(url.href);
}
