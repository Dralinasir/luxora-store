
"use client";

import { useState, type FormEvent } from "react";

type TrackedOrder = {
  order_number: string;
  status: string;
  created_at: string;
  payment_method: string;
  subtotal: number;
  items: {
    product_name: string;
    quantity: number;
    line_total: number;
  }[];
};

const steps = ["pending", "confirmed", "processing", "shipped", "delivered"];

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function trackOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const params = new URLSearchParams({
        orderNumber: orderNumber.trim(),
        phone: phone.trim(),
      });

      const response = await fetch(`/api/track-order?${params.toString()}`, {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Order nahi mila.");
      }

      setOrder(result.order);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Order search nahi ho saka."
      );
    } finally {
      setLoading(false);
    }
  }

  const money = (amount: number) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(amount);

  const currentStep = order ? steps.indexOf(order.status) : -1;

  return (
    <main className="min-h-screen bg-white px-4 py-12 text-black">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">
          LUXORA
        </p>

        <h1 className="mt-3 text-3xl font-bold md:text-4xl">
          Track Your Order
        </h1>

        <p className="mt-3 text-gray-600">
          Apna order number aur checkout wala phone number enter karein.
        </p>

        <form onSubmit={trackOrder} className="mt-8 space-y-4">
          <div>
            <label htmlFor="orderNumber" className="mb-2 block text-sm font-medium">
              Order Number
            </label>
            <input
              id="orderNumber"
              value={orderNumber}
              onChange={(event) => setOrderNumber(event.target.value)}
              placeholder="LUX-XXXXXXXX"
              required
              maxLength={100}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Checkout par diya gaya phone number"
              required
              maxLength={20}
              autoComplete="tel"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black px-6 py-3 font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Searching..." : "Track Order"}
          </button>
        </form>

        {error && (
          <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-red-700">
            {error}
          </p>
        )}

        {order && (
          <section className="mt-8 rounded-2xl border border-gray-200 p-5 md:p-7">
            <p className="text-sm text-gray-500">Order Number</p>
            <h2 className="mt-1 break-all text-lg font-bold">
              {order.order_number}
            </h2>

            <div className="mt-5 flex flex-wrap justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500">Current Status</p>
                <p className="mt-1 font-semibold capitalize">{order.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Total</p>
                <p className="mt-1 font-bold">{money(order.subtotal)}</p>
              </div>
            </div>

            {order.status === "cancelled" ? (
              <p className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
                This order has been cancelled. Please contact customer support
                if you need assistance.
              </p>
            ) : (
              <div className="mt-8">
                <h3 className="font-semibold">Delivery Progress</h3>
                <ol className="mt-5 space-y-4">
                  {steps.map((step, index) => {
                    const complete = currentStep >= 0 && index <= currentStep;

                    return (
                      <li key={step} className="flex items-center gap-3">
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                            complete
                              ? "bg-black text-white"
                              : "border border-gray-300 text-gray-500"
                          }`}
                        >
                          {complete ? "✓" : index + 1}
                        </span>
                        <span
                          className={`capitalize ${
                            complete ? "font-semibold" : "text-gray-500"
                          }`}
                        >
                          {step}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}

            <div className="mt-8 border-t pt-5">
              <h3 className="font-semibold">Items</h3>
              {order.items.map((item, index) => (
                <div
                  key={`${item.product_name}-${index}`}
                  className="mt-3 flex justify-between gap-3 text-sm"
                >
                  <span>{item.product_name} × {item.quantity}</span>
                  <span>{money(item.line_total)}</span>
                </div>
              ))}

              <p className="mt-5 text-sm text-gray-500">
                Payment method: {order.payment_method}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Ordered on: {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
