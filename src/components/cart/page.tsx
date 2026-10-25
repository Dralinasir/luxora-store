
"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { formatPKR } from "@/lib/config";

export default function CartPage() {
  const { items, remove, setQuantity, clear } = useCart();

  const total = items.reduce(
    (sum, item) => sum + item.priceMinor * item.quantity,
    0
  );

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold">Your Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="mt-10 rounded-xl border p-8 text-center">
          <h2 className="text-xl font-semibold">Your cart is empty</h2>
          <p className="mt-2 text-gray-500">
            Add some products to your cart to see them here.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-block rounded-full bg-black px-6 py-3 text-white"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-8 space-y-5">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center"
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-24 w-24 rounded-lg bg-gray-100 object-contain"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-gray-100">
                    LUXORA
                  </div>
                )}

                <div className="flex-1">
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-semibold hover:underline"
                  >
                    {item.name}
                  </Link>

                  <p className="mt-1">
                    {formatPKR(item.priceMinor)}
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity(item.productId, item.quantity - 1)
                      }
                      className="h-8 w-8 rounded-full border"
                      aria-label={`Decrease ${item.name} quantity`}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() =>
                        setQuantity(item.productId, item.quantity + 1)
                      }
                      disabled={item.quantity >= 20}
                      className="h-8 w-8 rounded-full border disabled:opacity-40"
                      aria-label={`Increase ${item.name} quantity`}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="sm:text-right">
                  <p className="font-semibold">
                    {formatPKR(item.priceMinor * item.quantity)}
                  </p>
                  <button
                    type="button"
                    onClick={() => remove(item.productId)}
                    className="mt-3 text-sm text-red-600 underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border p-6">
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatPKR(total)}</span>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="rounded-full border px-6 py-3"
              >
                Continue Shopping
              </Link>

              <button
                type="button"
                onClick={clear}
                className="rounded-full border border-red-300 px-6 py-3 text-red-600"
              >
                Clear Cart
              </button>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Checkout will be available when the checkout system is configured.
            </p>
          </div>
        </>
      )}
    </main>
  );
}
