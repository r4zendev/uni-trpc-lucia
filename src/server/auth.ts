// import { DrizzleAdapter } from "@auth/drizzle-adapter";
// import {
//   getServerSession,
//   type DefaultSession,
//   type NextAuthOptions,
// } from "next-auth";
// // import DiscordProvider from "next-auth/providers/discord";
// import GoogleProvider from "next-auth/providers/google";
// import { env } from "~/env.mjs";
// import { db } from "~/server/db";
// import { mysqlTable } from "~/server/db/schema";
// /**
//  * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
//  * object and keep type safety.
//  *
//  * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
//  */
// declare module "next-auth" {
//   interface Session extends DefaultSession {
//     user: {
//       id: string;
//       // ...other properties
//       // role: UserRole;
//     } & DefaultSession["user"];
//   }
//   // interface User {
//   //   // ...other properties
//   //   // role: UserRole;
//   // }
// }
// /**
//  * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
//  *
//  * @see https://next-auth.js.org/configuration/options
//  */
// export const authOptions: NextAuthOptions = {
//   callbacks: {
//     session: ({ session, user }) => ({
//       ...session,
//       user: {
//         ...session.user,
//         id: user.id,
//       },
//     }),
//   },
//   adapter: DrizzleAdapter(db, mysqlTable),
//   providers: [
//     GoogleProvider({
//       clientId: env.GOOGLE_CLIENT_ID,
//       clientSecret: env.GOOGLE_CLIENT_SECRET,
//     }),
//     /**
//      * ...add more providers here.
//      *
//      * Most other providers require a bit more work than the Discord provider. For example, the
//      * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
//      * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
//      *
//      * @see https://next-auth.js.org/providers/github
//      */
//   ],
// };
// /**
//  * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
//  *
//  * @see https://next-auth.js.org/configuration/nextjs
//  */
// export const getServerAuthSession = () => getServerSession(authOptions);
import { planetscale } from "@lucia-auth/adapter-mysql";
import { google } from "@lucia-auth/oauth/providers";
import { lucia } from "lucia";
import { nextjs_future } from "lucia/middleware";

import { env } from "~/env.mjs";
import { connection } from "~/server/db";

export const auth = lucia({
  env: env.NODE_ENV === "production" ? "PROD" : "DEV",
  middleware: nextjs_future(),
  sessionCookie: {
    expires: false,
    // name: "lucia_session",
  },
  adapter: planetscale(connection, {
    user: "uni_user",
    key: "uni_user_key",
    session: "uni_user_session",
  }),

  getUserAttributes: (data) => {
    return {
      email: data.email,
      id: data.id,
      // username: data.username,
    };
  },
});

// export const googleAuth = google(auth, {
//   clientId: env.GOOGLE_CLIENT_ID,
//   clientSecret: env.GOOGLE_CLIENT_SECRET,
//   redirectUri: env.APP_URL,
// });

export const googleAuth = google(auth, {
  clientId: env.GOOGLE_CLIENT_ID,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
  redirectUri: "http://localhost:3000/api/auth/callback/google",
  scope: [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "openid",
  ],
});

export type Auth = typeof auth;
