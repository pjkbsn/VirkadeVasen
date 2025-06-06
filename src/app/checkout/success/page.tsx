// Import necessary types for Next.js App Router
import { redirect } from "next/navigation";
import { Stripe } from "stripe";
import { stripe } from "@/lib/stripe";
import { clearCart } from "@/actions/cart";
import Link from "next/link";

// Define the type for the page props
type SuccessPageProps = {
  searchParams: {
    session_id?: string;
  };
};

export default async function Success({ searchParams }: SuccessPageProps) {
  const { session_id } = await searchParams;

  if (!session_id)
    throw new Error("Please provide a valid session_id (`cs_test_...`)");

  const {
    status,
    customer_details: { email: customerEmail },
  } = (await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  })) as Stripe.Checkout.Session & {
    customer_details: { email: string };
  };

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete") {
    clearCart();
    return (
      <div className="flex items-center justify-center py-16 px-4 h-full">
        <section className="max-w-3xl w-full text-center bg-white p-8 rounded-lg">
          <h1 className="text-2xl font-bold mb-6">Beställning mottagen!</h1>

          <div className="mb-6">
            <p className="mb-4">
              Tack för din beställning! Ett konfirmations mail kommer skickas
              till <span className="font-medium">{customerEmail}</span>.
            </p>

            <p>
              Om du har några funderingar, skicka mail till{" "}
              <a
                href="mailto:orders@example.com"
                className="text-blue-600 hover:underline"
              >
                orders@example.com
              </a>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link
              href="/products"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Fortsätt handla
            </Link>
          </div>
        </section>
      </div>
    );
  }
}
