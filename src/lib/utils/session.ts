import * as context from "next/headers";

import { auth } from "~/server/auth";

export const getServerSession = async () => {
  const authRequest = auth.handleRequest("GET", context);
  const session = await authRequest.validate();

  return session;
};
