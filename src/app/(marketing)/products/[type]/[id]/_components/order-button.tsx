"use client";

import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

export function OrderButton({ id }: { id: string }) {
  const { toast } = useToast();

  const { mutateAsync: addToCart } = api.items.addToCart.useMutation();

  return (
    <Button
      onClick={async () => {
        const response = await fetch("/api/cart", {
          method: "POST",
          body: JSON.stringify({ id }),
          redirect: "manual",
        });

        if (response.status === 200) {
          const { cookieName } = (await response.json()) as {
            cookieName: string;
          };
          await addToCart({ cookieId: cookieName, productId: id });

          toast({
            title: "Added to cart",
            description: "Your item has been added to the cart",
            variant: "success",
          });
        }
      }}
    >
      Add to cart
    </Button>
  );
}
