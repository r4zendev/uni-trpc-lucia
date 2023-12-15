import { LuciaError } from "lucia";
import * as context from "next/headers";
import type { NextRequest } from "next/server";

import { auth } from "~/server/auth";

const handler = async (req: NextRequest) => {
  const { email, password } = (await req.json()) as {
    email: string;
    password: string;
  };

  try {
    const key = await auth.useKey("username", email.toLowerCase(), password);

    const session = await auth.createSession({
      userId: key.userId,
      attributes: {},
    });

    const authRequest = auth.handleRequest("POST", context);
    authRequest.setSession(session);
  } catch (e) {
    if (
      e instanceof LuciaError &&
      (e.message === "AUTH_INVALID_KEY_ID" ||
        e.message === "AUTH_INVALID_PASSWORD")
    ) {
      // throw new Error("Incorrect username or password");
      return new Response(null, {
        status: 401,
        statusText: "Incorrect username or password",
      });
    }
  }

  return new Response(null, {
    status: 200,
    statusText: "OK",
  });
};

export { handler as GET, handler as POST };
