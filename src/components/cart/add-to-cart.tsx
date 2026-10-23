
"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/cart-provider";

export function AddToCart({
  product
}: {
  product: {
    id: string;
    slug: string;
    name: string;
    priceMinor: number;
    imageUrl: string | null;
  };
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      className="button button-dark"
      onClick={() => {
        add({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          priceMinor: product.priceMinor,
          imageUrl: product.imageUrl
        });

        setAdded(true);
      }}
      aria-live="polite"
    >
      {added ? "Added to bag ✓" : "Add to bag"}
    </button>
  );
}
