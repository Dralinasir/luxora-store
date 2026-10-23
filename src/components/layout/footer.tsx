
import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div>
        <Link href="/" className="wordmark">
          LUXORA<span>®</span>
        </Link>
        <p>Considered essentials for everyday living.</p>
      </div>

      <div>
        <strong>Customer care</strong>
        <Link href="/pages/contact">Contact</Link>
        <Link href="/pages/shipping">Shipping & delivery</Link>
        <Link href="/pages/returns">Returns</Link>
      </div>

      <div>
        <strong>Discover</strong>
        <Link href="/products">Shop all</Link>
        <Link href="/pages/about">About LUXORA</Link>
        <Link href="/pages/privacy">Privacy policy</Link>
      </div>

      <div className="copyright">
        © {new Date().getFullYear()} LUXORA. All rights reserved.
        Prices in PKR.
      </div>
    </footer>
  );
}
