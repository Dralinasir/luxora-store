
"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/cart-provider";

type Props = {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    image_url: string | null;
    stock: number;
  };
};

export function AddToCartButton({ product }: Props) {
  const { items, add, setQuantity } = useCart();
  const [message, setMessage] = useState("");

  const cartItem = items.find(
    (item) => item.productId === product.id
  );

  const quantity = cartItem?.quantity ?? 0;
  const unavailable = product.stock <= 0;
  const limitReached = quantity >= Math.min(product.stock, 20);

  function handleAdd() {
    if (unavailable) return;

    if (cartItem) {
      if (limitReached) {
        setMessage("Maximum available quantity reached.");
        return;
      }

      setQuantity(product.id, quantity + 1);
    } else {
      add({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        priceMinor: product.price,
        imageUrl: product.image_url,
      });
    }

    setMessage("Added to cart successfully!");
  }

  return (
    <div className="mt-8">
      {quantity > 0 && (
        <div className="mb-3 flex items-center gap-4">
          <button
            type="button"
            onClick={() => setQuantity(product.id, quantity - 1)}
            className="h-10 w-10 rounded-full border"
            aria-label="Decrease quantity"
          >
            −
          </button>

          <span className="font-semibold">{quantity}</span>

          <button
            type="button"
            onClick={handleAdd}
            disabled={limitReached || unavailable}
            className="h-10 w-10 rounded-full border disabled:opacity-40"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={handleAdd}
        disabled={unavailable}
        className="w-full rounded-full bg-black px-8 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {unavailable
          ? "Out of Stock"
          : quantity > 0
            ? "Add Another"
            : "Add to Cart"}
      </button>

      {message && (
        <p role="status" className="mt-3 text-sm text-green-700">
          {message}
        </p>
      )}
    </div>
  );
}
