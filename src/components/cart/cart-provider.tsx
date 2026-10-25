
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  priceMinor: number;
  imageUrl: string | null;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  add: (item: Omit<CartItem, "quantity">) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "luxora-cart-v1";

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed: unknown = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setItems(
            parsed.filter(
              (item): item is CartItem =>
                item !== null &&
                typeof item === "object" &&
                typeof item.productId === "string" &&
                typeof item.slug === "string" &&
                typeof item.name === "string" &&
                typeof item.priceMinor === "number" &&
                Number.isFinite(item.priceMinor) &&
                typeof item.quantity === "number" &&
                Number.isInteger(item.quantity) &&
                item.quantity >= 1 &&
                item.quantity <= 20 &&
                (typeof item.imageUrl === "string" ||
                  item.imageUrl === null)
            )
          );
        }
      }
    } catch (error) {
      console.error("Could not load cart:", error);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(items)
      );
    } catch (error) {
      console.error("Could not save cart:", error);
    }
  }, [items, ready]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,

      add: (item) =>
        setItems((old) => {
          const existing = old.find(
            (entry) => entry.productId === item.productId
          );

          if (existing) {
            return old.map((entry) =>
              entry.productId === item.productId
                ? {
                    ...entry,
                    quantity: Math.min(20, entry.quantity + 1),
                  }
                : entry
            );
          }

          return [...old, { ...item, quantity: 1 }];
        }),

      remove: (id) =>
        setItems((old) =>
          old.filter((item) => item.productId !== id)
        ),

      setQuantity: (id, quantity) => {
        if (!Number.isInteger(quantity)) return;

        if (quantity <= 0) {
          setItems((old) =>
            old.filter((item) => item.productId !== id)
          );
          return;
        }

        setItems((old) =>
          old.map((item) =>
            item.productId === id
              ? { ...item, quantity: Math.min(20, quantity) }
              : item
          )
        );
      },

      clear: () => setItems([]),

      count: items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    [items]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
