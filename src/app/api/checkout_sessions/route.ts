import { getCart } from "@/actions/cart";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const headersList = await headers();
    const origin =
      headersList.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const { data: cartItems, success } = await getCart();

    if (!success || !cartItems.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: "sek",
        product_data: {
          name: item.products.product_groups.name,
          description: `Färg: ${item.products.colors.name}`,
          images:
            item.products.image_url && item.products.image_url.length
              ? [item.products.image_url[0]]
              : [],
        },
        unit_amount: Math.round(item.products.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "klarna"],
      line_items,
      mode: "payment",
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cart`,
      shipping_address_collection: {
        allowed_countries: ["SE"],
      },
      billing_address_collection: "auto",
      locale: "sv",
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Error creating checkout session: " + error.message },
      { status: 500 }
    );
  }
}
