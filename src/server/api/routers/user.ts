import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export const userRouter = createTRPCRouter({
  signup: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string().min(6) }))
    .mutation(async ({ input }) => {
      const { email, password } = input;

      const user = await auth.createUser({
        key: {
          providerId: "username", // auth method
          providerUserId: email, // unique id when using "username" auth method
          password, // hashed by Lucia
        },
        attributes: {
          email,
        },
      });

      return user;
    }),
  me: protectedProcedure.input(z.void()).query(async ({ ctx }) => {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, ctx.session.user.userId),
    });

    if (!user) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User not found.",
      });
    }

    return user;
  }),
});
