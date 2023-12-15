import Image from "next/image";
import Link from "next/link";

import { Card, CardContent } from "~/components/ui/card";
import type { CategoriesQueryResult, QueriedItem } from "~/lib/sanity/queries";
import { cn } from "~/lib/utils";

const ContentCard = ({ item }: { item: { name: string; image: string } }) => (
  <Card className="relative overflow-hidden">
    <CardContent>
      <Image
        src={item.image}
        alt={item.name ?? "Item"}
        width={500}
        height={500}
        className={cn(
          "h-auto w-auto object-cover transition-all hover:scale-105",
        )}
      />

      <span className="absolute text-lg left-1/2 bottom-0 translate-x-[-50%]">
        {item.name}
      </span>
    </CardContent>
  </Card>
);

export function TrendingItem({
  item,
}: {
  item: QueriedItem & { count: number };
}) {
  return (
    <Link
      href={`/products/${item.category.slug}/${item._id}`}
      className="overflow-hidden rounded-md w-[16rem] shrink-0"
    >
      {item.image ? (
        <ContentCard item={item} />
      ) : (
        <div className="h-32 w-32 bg-gray-100" />
      )}
    </Link>
  );
}

export function CategoryItem({
  item,
}: {
  item: CategoriesQueryResult[number];
}) {
  return (
    <Link
      href={`/products/${item.slug}`}
      className="overflow-hidden rounded-md w-[16rem] shrink-0"
    >
      <ContentCard item={item} />
    </Link>
  );
}
