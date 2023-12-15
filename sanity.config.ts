import { defineConfig, type InferSchemaValues } from "@sanity-typed/types";
import { deskTool } from "sanity/desk";

import { env } from "~/env.mjs";
import { schemas } from "~/lib/sanity/schemas";

const config = defineConfig({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  title: "Jewelry Store",
  basePath: "/admin",
  plugins: [deskTool()],
  schema: { types: schemas },
});

export default config;

export type SanityValues = InferSchemaValues<typeof config>;
