import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { cookies, headers } from "next/headers";
import type { NextRequest } from "next/server";

import { auth, googleAuth } from "~/server/auth";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

const handler = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const storedState = cookies().get("google_oauth_state");

  if (!storedState || !state || storedState.value !== state || !code) {
    return new Response(null, {
      status: 400,
    });
  }

  /**
   * Here we go...
   */
  try {
    const {
      googleUser: { email: googleUserEmail, name, picture },
      createUser,
    } = await googleAuth.validateCallback(code);

    if (!googleUserEmail) {
      return new Response(null, {
        status: 400,
      });
    }

    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, googleUserEmail),
    });

    const getUser = async () => {
      if (existingUser) {
        let updated = false;
        if (!existingUser.image) {
          await db
            .update(users)
            .set({ image: picture })
            .where(eq(users.id, existingUser.id));
          updated = true;
        }

        if (!existingUser.name) {
          await db
            .update(users)
            .set({ name })
            .where(eq(users.id, existingUser.id));
          updated = true;
        }

        if (updated) {
          return await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, googleUserEmail),
          });
        }

        return existingUser;
      }

      const user = await createUser({
        userId: nanoid(15),
        attributes: {
          email: googleUserEmail,
          name,
          image: picture,
        },
      });

      return user;
    };

    const user = await getUser();

    if (!user) {
      return new Response(null, {
        status: 500,
      });
    }

    const session = await auth.createSession({
      userId: user.id,
      attributes: {},
    });

    auth.handleRequest("GET", { cookies, headers }).setSession(session);

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (e) {
    // TODO: Log error into system.
    console.log(e);

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  }
};

export { handler as GET, handler as POST };
