
import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatPKR } from "@/lib/config";

export function ProductCard({ product }: { product: Product }) {
  const price = product.price;
  const originalPrice = product.compare_at_price;

  const isOnSale =
    originalPrice !== null && originalPrice > price;

  const discount = isOnSale
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <article className="product-card group">
      <Link
        href={`/products/${product.slug}`}
        className="product-image-wrap"
        aria-label={`View ${product.name}`}
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="image-placeholder flex h-full items-center justify-center bg-neutral-100 text-sm font-semibold tracking-[0.3em] text-neutral-500">
            LUXORA
          </div>
        )}

        {isOnSale && (
          <span className="sale-tag">
            -{discount}%
          </span>
        )}

        <span className="absolute bottom-3 right-3 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100">
          View Product
        </span>
      </Link>

      <div className="product-card-info">
        <Link
          href={`/products/${product.slug}`}
          className="product-name transition-colors hover:text-neutral-500"
        >
          {product.name}
        </Link>

        {product.category && (
          <p className="mt-1 text-xs uppercase tracking-widest text-neutral-500">
            {product.category}
          </p>
        )}

        <div className="price-row mt-2">
          <span className="font-semibold text-black">
            {formatPKR(price)}
          </span>

          {isOnSale && (
            <del className="text-sm text-neutral-400">
              {formatPKR(originalPrice)}
            </del>
          )}
        </div>
      </div>
    </article>
  );
}
