import { TRPCError } from "@trpc/server";
import sub from "date-fns/sub";
import { desc, eq, gte, sql } from "drizzle-orm";
import { z } from "zod";

import { getItemById, getItems } from "~/lib/sanity/queries";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { cart, itemViews } from "~/server/db/schema";

export const itemRouter = createTRPCRouter({
  click: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const updateResult = await ctx.db
        .insert(itemViews)
        .values({ externalId: input.id });

      return updateResult;
    }),
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const item = await getItemById(input.id);

      if (!item) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Item not found",
        });
      }

      return item;
    }),
  trending: publicProcedure.input(z.void()).query(async ({ ctx }) => {
    const items = await ctx.db
      .select({
        count: sql<number>`count(*)`,
        externalId: itemViews.externalId,
      })
      .from(itemViews)
      .where(gte(itemViews.createdAt, sub(new Date(), { days: 7 })))
      .groupBy(itemViews.externalId)
      .orderBy(desc(sql`count(*)`))
      .limit(5);

    const sanityItems = await getItems({
      ids: items.map((item) => item.externalId),
    });

    if (sanityItems.length < 5) {
      sanityItems.push(...(await getItems({ limit: 5 - sanityItems.length })));
    }

    return sanityItems.map((sanityItem) => {
      const item = items.find((item) => item.externalId === sanityItem._id);
      return {
        ...sanityItem,
        count: item?.count ?? 0,
      };
    });
  }),
  addToCart: publicProcedure
    .input(z.object({ cookieId: z.string(), productId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const existing = await db.query.cart.findFirst({
        where: ({ cookieId }) => eq(cookieId, input.cookieId),
      });

      const update = {
        userId: ctx.session?.user?.id,
        productIds: existing?.productIds
          ? [...existing.productIds, input.productId]
          : [input.productId],
      };
      await db
        .insert(cart)
        .values({
          cookieId: input.cookieId,
          ...update,
        })
        .onDuplicateKeyUpdate({
          set: update,
        });
    }),
});
