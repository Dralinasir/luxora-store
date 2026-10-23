
import Link from "next/link";
import { Search, ShoppingBag, UserRound } from "lucide-react";

export function Header() {
  return (
    <>
      <div className="announcement">
        LUXORA · Considered essentials for everyday living
      </div>

      <header className="site-header">
        <Link href="/" className="wordmark" aria-label="LUXORA home">
          LUXORA<span>®</span>
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          <Link href="/products">Shop all</Link>
          <Link href="/products?sort=newest">New arrivals</Link>
          <Link href="/pages/about">Our story</Link>
        </nav>

        <form action="/products" className="header-search">
          <Search size={17} aria-hidden="true" />
          <input
            name="q"
            placeholder="Search products"
            aria-label="Search products"
          />
        </form>

        <div className="header-actions">
          <Link href="/account" aria-label="Customer account">
            <UserRound size={20} />
          </Link>

          <Link href="/cart" aria-label="Shopping bag">
            <ShoppingBag size={20} />
          </Link>
        </div>
      </header>
    </>
  );
}
