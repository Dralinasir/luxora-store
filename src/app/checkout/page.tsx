
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { formatPKR } from "@/lib/config";

export default function CheckoutPage() {
  const { items, clear } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const total = items.reduce(
    (sum, item) => sum + item.priceMinor * item.quantity,
    0
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) return;

    if (items.length === 0) {
      setMessage("Your cart is empty. Please add a product first.");
      return;
    }

    setSubmitting(true);
    setMessage("Placing your order...");
    setOrderNumber("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          city,
          address,
          email,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(
          result.error || "Order could not be placed. Please try again."
        );
        return;
      }

      setOrderNumber(result.orderNumber);
      setMessage("Your COD order has been placed successfully!");
      clear();
    } catch {
      setMessage(
        "Server se connection nahi ho saka. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (orderNumber) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-20 text-center">
        <div className="text-5xl">✓</div>
        <h1 className="mt-5 text-3xl font-bold">
          Thank You for Your Order!
        </h1>
        <p className="mt-4 text-gray-600">{message}</p>
        <p className="mt-4">
          Order Number: <strong>{orderNumber}</strong>
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Payment method: Cash on Delivery (COD)
        </p>
        <Link
          href="/products"
          className="mt-8 inline-block rounded-full bg-black px-7 py-3 text-white"
        >
          Continue Shopping
        </Link>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="mt-4 text-gray-600">
          Your cart is empty. Add a product before checkout.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-full bg-black px-6 py-3 text-white"
        >
          Explore Products
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <p className="mt-2 text-gray-600">
        Enter your delivery details to place your order.
      </p>

      <div className="mt-10 grid gap-10 md:grid-cols-[1fr_360px]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="text-xl font-semibold">
            Delivery Information
          </h2>

          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Full Name *
            </label>
            <input
              id="name"
              name="name"
              autoComplete="name"
              required
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium">
              Phone Number *
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              maxLength={20}
              pattern="[0-9+() -]{7,20}"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              placeholder="03XXXXXXXXX"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email (optional)
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="city" className="mb-2 block text-sm font-medium">
              City *
            </label>
            <input
              id="city"
              name="city"
              autoComplete="address-level2"
              required
              maxLength={100}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              placeholder="e.g. Faisalabad"
            />
          </div>

          <div>
            <label htmlFor="address" className="mb-2 block text-sm font-medium">
              Complete Delivery Address *
            </label>
            <textarea
              id="address"
              name="address"
              autoComplete="street-address"
              required
              minLength={10}
              maxLength={500}
              rows={4}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              placeholder="House number, street, area and nearest landmark"
            />
          </div>

          <div className="rounded-lg border p-4">
            <p className="font-semibold">Payment Method</p>
            <p className="mt-2 text-sm text-gray-600">
              Cash on Delivery (COD)
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Pay when your order is delivered.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-black px-6 py-4 font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Placing Order..." : "Place COD Order"}
          </button>

          {message && (
            <p role="status" className="rounded-lg bg-gray-100 p-4 text-sm">
              {message}
            </p>
          )}
        </form>

        <aside className="h-fit rounded-xl border p-6">
          <h2 className="text-xl font-semibold">Order Summary</h2>

          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between gap-4 text-sm"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span className="shrink-0 font-medium">
                  {formatPKR(item.priceMinor * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between border-t pt-5 font-bold">
            <span>Total</span>
            <span>{formatPKR(total)}</span>
          </div>

          <Link
            href="/cart"
            className="mt-6 inline-block text-sm underline"
          >
            Back to Cart
          </Link>
        </aside>
      </div>
    </main>
  );
}
