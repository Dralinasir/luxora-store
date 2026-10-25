
"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { formatPKR } from "@/lib/config";

export default function CartPage() {
  const { items, remove, setQuantity } = useCart();

  const subtotal = items.reduce(
    (total, item) => total + item.priceMinor * item.quantity,
    0
  );

  return (
    <main className="min-h-[70vh] bg-white px-5 py-14 text-black sm:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
          Your Shopping Bag
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold sm:text-4xl">
            Shopping Cart
          </h1>

          <Link href="/products" className="text-sm underline underline-offset-4">
            Continue shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="mt-12 border border-gray-200 px-6 py-16 text-center">
            <ShoppingBag className="mx-auto h-10 w-10" strokeWidth={1.3} />

            <h2 className="mt-5 text-xl font-semibold">
              Your cart is currently empty
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Explore our collection and find something you love.
            </p>

            <Link
              href="/products"
              className="mt-7 inline-block bg-black px-7 py-3 text-sm font-medium text-white"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_350px]">
            <section>
              <div className="hidden grid-cols-[1fr_120px_120px] border-b border-gray-200 pb-4 text-xs uppercase tracking-wider text-gray-500 sm:grid">
                <span>Product</span>
                <span className="text-center">Quantity</span>
                <span className="text-right">Total</span>
              </div>

              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="grid gap-4 py-6 sm:grid-cols-[1fr_120px_120px] sm:items-center"
                  >
                    <div className="flex items-center gap-4">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-20 w-20 rounded-lg bg-gray-100 object-contain"
                        />
                      ) : null}

                      <div>
                        <Link
                          href={`/products/${item.slug}`}
                          className="font-medium hover:underline"
                        >
                          {item.name}
                        </Link>

                        <p className="mt-2 text-sm text-gray-500">
                          {formatPKR(item.priceMinor)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:justify-center">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() =>
                          setQuantity(item.productId, item.quantity - 1)
                        }
                        className="border border-gray-300 p-2"
                      >
                        <Minus size={14} />
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        aria-label="Increase quantity"
                        disabled={item.quantity >= 20}
                        onClick={() =>
                          setQuantity(item.productId, item.quantity + 1)
                        }
                        className="border border-gray-300 p-2 disabled:opacity-40"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end sm:gap-3">
                      <span className="font-medium">
                        {formatPKR(item.priceMinor * item.quantity)}
                      </span>

                      <button
                        type="button"
                        aria-label={`Remove ${item.name}`}
                        onClick={() => remove(item.productId)}
                        className="text-gray-500 hover:text-black"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <aside className="h-fit border border-gray-200 p-6">
              <h2 className="text-lg font-semibold">Order Summary</h2>

              <div className="mt-6 flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPKR(subtotal)}</span>
              </div>

              <p className="mt-3 text-xs leading-5 text-gray-500">
                Shipping and applicable taxes are calculated at checkout.
              </p>

              <div className="mt-6 border-t border-gray-200 pt-5">
                <div className="flex justify-between font-semibold">
                  <span>Estimated total</span>
                  <span>{formatPKR(subtotal)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-7 block bg-black px-5 py-4 text-center text-sm font-semibold text-white hover:bg-gray-800"
              >
                Proceed to Checkout
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
