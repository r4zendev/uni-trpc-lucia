import {
  defineArrayMember,
  defineField,
  defineType,
} from "@sanity-typed/types";

export const itemSchema = defineType({
  name: "item",
  title: "Items",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "discount",
      title: "Discount",
      type: "number",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" as const }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "views",
      type: "number",
      title: "Views",
      hidden: true,
      initialValue: 0,
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Alt",
          type: "string",
        },
      ],
    }),
    // {
    //   name: "url",
    //   title: "URL",
    //   type: "url",
    // },
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      of: [defineArrayMember({ type: "block" }) as any],
    }),
  ],
});

export type Item = typeof itemSchema;
