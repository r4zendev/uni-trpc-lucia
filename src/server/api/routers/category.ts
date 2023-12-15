import { z } from "zod";

import { getCategories } from "~/lib/sanity/queries";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const categoryRouter = createTRPCRouter({
  all: publicProcedure.input(z.void()).query(async ({ ctx }) => {
    const categories = await getCategories();

    return categories.slice(0, 5);
  }),
});
