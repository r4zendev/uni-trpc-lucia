import { setCookie } from "cookies-next";
import { nanoid } from "nanoid";
import { cookies } from "next/headers";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Button } from "~/components/ui/button";
import { type ProductType } from "~/lib/types";
import { getCartFromCookie } from "~/lib/utils/cart";
import { api } from "~/trpc/server";

import { OrderButton } from "./_components/order-button";

export default async function Product({
  params: { id },
}: {
  params: { type: ProductType; id: string };
}) {
  const product = await api.items.get.query({ id });

  if (!product) {
    return notFound();
  }

  await api.items.click.mutate({ id });

  return (
    <div>
      <p>Product</p>
      <p>{product._id}</p>
      <p>{product._createdAt}</p>
      <Image
        src={product.image}
        alt={product.name ?? "Item"}
        width={500}
        height={500}
      />

      <OrderButton id={id} />
    </div>
  );
}
