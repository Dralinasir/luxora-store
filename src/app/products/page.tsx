
import Link from "next/link";

export default function ProductsPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-3xl font-bold">All Products</h1>
      <p className="mt-4 text-gray-600">
        Welcome to the LUXORA product store.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block underline"
      >
        Back to Home
      </Link>
    </main>
  );
}
