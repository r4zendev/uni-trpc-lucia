import { groq } from "next-sanity";

import { sanityClient } from "~/lib/sanity/client";
import { type SocialProvider } from "~/lib/types";
import { type SanityValues } from "~/sanity.config";

export type CategoriesQueryResult = Array<{
  name: string;
  slug: string;
  image: string;
}>;

export type QueriedItem = Omit<SanityValues["item"], "image" | "category"> & {
  image: string;
  category: CategoriesQueryResult[number];
  discountedPrice: number;
};

export async function getItems(options?: {
  ids?: string[];
  limit?: number;
}): Promise<QueriedItem[]> {
  const { ids, limit } = options ?? {};
  const params = Object.fromEntries(
    Object.entries({ ids, limit }).filter(([, value]) => Boolean(value)),
  );

  return sanityClient.fetch(
    groq`*[_type == "item"${ids ? " && _id in $ids" : ""}]${
      limit ? `[0...${limit}]` : ""
    }{
      _id,
      _createdAt,
      name,
      description,
      price,
      "slug": slug.current,
      "image": image.asset->url,
      "discountedPrice": price * (1 - discount),
      "category": category->{
        name,
        "image": image.asset->url,
        "slug": slug.current,
      },
      url,
      content
    }`,
    params,
  );
}

export async function getItemById(id: string): Promise<QueriedItem> {
  return sanityClient.fetch(
    groq`*[_type == "item" && _id == $id][0]{
      _id,
      _createdAt,
      name,
      description,
      price,
      "slug": slug.current,
      "image": image.asset->url,
      "discountedPrice": price * (1 - discount),
      "category": category->{
        name,
        "image": image.asset->url,
        "slug": slug.current,
      },
      url,
      content
    }`,
    { id },
  );
}

export async function getCategories(): Promise<CategoriesQueryResult> {
  return sanityClient.fetch(
    groq`*[_type == "category"] {
      name,
      "slug": slug.current,
      "image": image.asset->url,
    }`,
  );
}

export type QueriedBanner = Omit<SanityValues["banner"], "image"> & {
  image: string;
  alt: string;
};

export async function getBannerImage(): Promise<QueriedBanner> {
  return sanityClient.fetch(
    groq`*[_type == "banner" && position == "top"][0]{
      _id,
      _createdAt,
      "image": image.asset->url,
      "alt": image.alt,
      url,
    }`,
  );
}

export async function getSliderImages(): Promise<QueriedBanner[]> {
  return sanityClient.fetch(
    groq`*[_type == "banner" && position == "slider"][0...5]{
      _id,
      _createdAt,
      "image": image.asset->url,
      "alt": image.alt,
      url,
    }`,
  );
}

type QueriedLink = Omit<SanityValues["social"], "provider"> & {
  provider: SocialProvider;
};

export async function getSocialLinks(): Promise<QueriedLink[]> {
  return sanityClient.fetch(
    groq`*[_type == "social"]{
      _id,
      _createdAt,
      provider,
      url,
    }`,
  );
}
