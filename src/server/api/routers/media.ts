import { z } from "zod";

import {
  getBannerImage,
  getSliderImages,
  getSocialLinks,
} from "~/lib/sanity/queries";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const mediaRouter = createTRPCRouter({
  banner: publicProcedure.input(z.void()).query(async () => {
    return getBannerImage();
  }),
  sliderImages: publicProcedure.input(z.void()).query(async () => {
    return getSliderImages();
  }),
  social: publicProcedure.input(z.void()).query(async () => {
    return getSocialLinks();
  }),
});
