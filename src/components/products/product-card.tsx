
import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatPKR } from "@/lib/config";

export function ProductCard({
  product
}: {
  product: Product;
}) {
  const price = product.sale_price_minor ?? product.price_minor;

  return (
    <article className="product-card">
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
          />
        ) : (
          <div className="image-placeholder">LUXORA</div>
        )}

        {product.sale_price_minor !== null && (
          <span className="sale-tag">Sale</span>
        )}
      </Link>

      <div className="product-card-info">
        <Link
          href={`/products/${product.slug}`}
          className="product-name"
        >
          {product.name}
        </Link>

        <div className="price-row">
          <span>{formatPKR(price)}</span>

          {product.sale_price_minor !== null && (
            <del>{formatPKR(product.price_minor)}</del>
          )}
        </div>
      </div>
    </article>
  );
}
