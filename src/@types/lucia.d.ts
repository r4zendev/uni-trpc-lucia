/// <reference types="lucia" />
declare namespace Lucia {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  type Auth = import("~/server/auth").Auth;
  type DatabaseUserAttributes = {
    email: string;
    name?: string;
    image?: string;
    // username: string;
  };
  type DatabaseSessionAttributes = Record<string, unknown>;
}
