import { nanoid } from "nanoid";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

import { getCartFromCookie } from "~/lib/utils/cart";

const handler = async (req: NextRequest) => {
  const { id } = (await req.json()) as {
    id: string;
  };

  // eslint-disable-next-line prefer-const
  const cartCookie = getCartFromCookie();
  let value = "";
  let cookieName = "";
  if (!cartCookie) {
    const uuid = nanoid();

    cookieName = `cart:${uuid}`;
    value = id;
  } else {
    cookieName = cartCookie.cookieName;
    value =
      cartCookie.cart.join(", ") + `${cartCookie.cart.length ? ", " : ""}${id}`;
  }

  cookies().set(cookieName, value);

  return NextResponse.json({ cookieName });
};

export { handler as GET, handler as POST };
