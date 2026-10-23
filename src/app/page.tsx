
import Link from "next/link";
import { getProducts } from "@/lib/products";
import { ProductCard } from "@/components/products/product-card";

export default async function HomePage() {
  const { products, configured } = await getProducts({
    limit: 4,
    featured: true
  });

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">THE LUXORA EDIT · 01</span>

          <h1>
            Everyday,
            <br />
            elevated.
          </h1>

          <p>
            Thoughtfully selected essentials for the way you live,
            work, and move through the world.
          </p>

          <Link className="button button-dark" href="/products">
            Explore the collection
          </Link>
        </div>

        <div className="hero-art" aria-label="LUXORA brand artwork">
          L.
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">EXPLORE LUXORA</span>
            <h2>Shop by mood</h2>
          </div>

          <Link className="text-link" href="/products">
            View all products
          </Link>
        </div>

        <div className="category-grid">
          <Link className="category-tile" href="/products">
            <span>01 / EVERYDAY</span>
            <strong>Everyday essentials ↗</strong>
          </Link>

          <Link
            className="category-tile"
            href="/products?sort=newest"
          >
            <span>02 / JUST IN</span>
            <strong>New arrivals ↗</strong>
          </Link>

          <Link className="category-tile" href="/products?sale=true">
            <span>03 / CONSIDERED FINDS</span>
            <strong>Special offers ↗</strong>
          </Link>
        </div>
      </section>

      <section className="section featured-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">CURATED FOR YOU</span>
            <h2>Featured products</h2>
            <p>Discover something you will love.</p>
          </div>

          <Link className="text-link" href="/products">
            Shop all
          </Link>
        </div>

        {!configured && (
          <div className="notice">
            Connect Supabase and apply the database migrations to load
            your published catalog.
          </div>
        )}

        {products.length > 0 ? (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>Your next favourite starts here.</h2>
            <p className="muted">
              Published products will appear here when your catalog
              is configured.
            </p>
            <Link className="button button-light" href="/products">
              Browse catalog
            </Link>
          </div>
        )}
      </section>

      <section className="newsletter">
        <span className="eyebrow">THE LUXORA LETTER</span>
        <h2>Good things, occasionally.</h2>
        <p>New collections and thoughtful finds, delivered with care.</p>
        <Link className="button button-dark" href="/pages/contact">
          Get in touch
        </Link>
      </section>
    </>
  );
}
