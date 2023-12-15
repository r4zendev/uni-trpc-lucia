import { categoryRouter } from "~/server/api/routers/category";
import { itemRouter } from "~/server/api/routers/item";
import { mediaRouter } from "~/server/api/routers/media";
import { productRouter } from "~/server/api/routers/product";
import { userRouter } from "~/server/api/routers/user";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  products: productRouter,
  users: userRouter,
  items: itemRouter,
  categories: categoryRouter,
  media: mediaRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
export type TRPCErrorWithData = {
  data: {
    code: string;
    httpStatus: number;
    path: string;
    stack?: string;
    zodError: string | null;
  };
};
