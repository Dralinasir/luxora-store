
"use client";

import { useCallback, useEffect, useState } from "react";

type OrderItem = {
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
};

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  email: string | null;
  city: string;
  address: string;
  payment_method: string;
  status: string;
  subtotal: number;
  created_at: string;
  items: OrderItem[];
};

const statuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState("");
const [successMessage, setSuccessMessage] = useState("");
const [selectedStatuses, setSelectedStatuses] = useState<
  Record<string, string>
>({});

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin-orders", {
        cache: "no-store",
      });

      const result = await response.json();

     
      if (!response.ok) {
        throw new Error(
          `Error ${response.status}: ${result.error || "Orders load nahi ho sake."}`
        );
      }

      setOrders(result.orders ?? []);

    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Koi error aa gaya."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

 const updateOrderStatus = async (
  orderId: string,
  status: string
) => {
  setUpdatingOrderId(orderId);
  setError("");
  setSuccessMessage("");

  try {
    console.log("Updating order:", orderId, "New status:", status);
    const response = await fetch(`/api/admin-orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Status update nahi ho saka.");
    }

    setSuccessMessage(`Order status updated to ${status}.`);
    await loadOrders();
  } catch (err) {
    setError(
      err instanceof Error ? err.message : "Status update failed."
    );
  } finally {
    setUpdatingOrderId("");
  }
};
 const money = (amount: number) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <main className="min-h-screen bg-gray-100 p-4 text-black md:p-10">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
          LUXORA / ADMIN
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Order Management</h1>
            <p className="mt-2 text-gray-600">
              Customer orders aur delivery status manage karein.
            </p>
          </div>

          <button
            onClick={() => void loadOrders()}
            className="rounded-lg bg-black px-4 py-2 font-semibold text-white"
          >
            Refresh Orders
          </button>
        </div>

        <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex flex-wrap justify-between gap-2">
            <h2 className="text-lg font-semibold">Customer Orders</h2>
            {successMessage && (
  <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm font-medium text-green-800">
    {successMessage}
  </p>
)}
            <p className="text-sm text-gray-500">
              Total: {orders.length}
            </p>
          </div>

          {loading && (
            <p className="mt-5 text-gray-600">Orders load ho rahe hain...</p>
          )}

          {!loading && error && (
            <div className="mt-5 rounded-lg bg-red-50 p-4 text-red-700">
              <p>{error}</p>
              <button
                onClick={() => void loadOrders()}
                className="mt-3 rounded-md border border-red-300 px-3 py-2"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <p className="mt-5 text-gray-600">
              Abhi koi customer order nahi mila.
            </p>
          )}

          <div className="mt-5 space-y-5">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-xl border p-4 md:p-6"
              >
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <h3 className="font-bold">{order.order_number}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>

                  <p className="font-bold">{money(order.subtotal)}</p>
                </div>

                <div className="mt-4 grid gap-4 text-sm md:grid-cols-2">
                  <div>
                    <p className="font-semibold">Customer</p>
                    <p>{order.customer_name}</p>
                    <p>{order.phone}</p>
                    <p>{order.email || "Email nahi di gayi"}</p>
                  </div>

                  <div>
                    <p className="font-semibold">Delivery Address</p>
                    <p>{order.address}</p>
                    <p>{order.city}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="font-semibold">Items</p>
                  {order.items.map((item, index) => (
                    <div
                      key={`${order.id}-${index}`}
                      className="mt-2 flex flex-wrap justify-between gap-2 text-sm"
                    >
                      <span>
                        {item.product_name} × {item.quantity}
                      </span>
                      <span>{money(item.line_total)}</span>
                    </div>
                  ))}
                </div>

                
<div className="mt-4 border-t pt-4">
  <p className="text-sm text-gray-600">
    Payment: {order.payment_method || "Cash on Delivery"}
  </p>

  <p className="mt-2 text-sm">
    Current Status:{" "}
    <span className="font-semibold capitalize">
      {order.status}
    </span>
  </p>

  <div className="mt-4 flex flex-wrap items-center gap-3">
    <select
  value={selectedStatuses[order.id] ?? order.status}
  onChange={(event) =>
    setSelectedStatuses((previous) => ({
      ...previous,
      [order.id]: event.target.value,
    }))
  }
  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
  disabled={updatingOrderId === order.id}
>
  {statuses.map((status) => (
    <option key={status} value={status}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </option>
  ))}
</select>

    <button
      type="button"
      onClick={() =>
  void updateOrderStatus(
    order.id,
    selectedStatuses[order.id] ?? order.status
  )
}
      disabled={updatingOrderId === order.id}
      className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
    >
      {updatingOrderId === order.id ? "Updating..." : "Update Status"}
    </button>
  </div>
</div>

              </article>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
