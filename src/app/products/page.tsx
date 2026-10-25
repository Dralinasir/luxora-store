
import Link from "next/link";
import { getProducts } from "@/lib/products";
import { ProductCard } from "@/components/products/product-card";

export default async function ProductsPage() {
  const { products, configured, error } = await getProducts({
    limit: 48,
  });

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-widest text-gray-500">
          LUXORA COLLECTION
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          All Products
        </h1>

        <p className="mt-3 text-gray-600">
          Discover everyday essentials for your lifestyle.
        </p>
      </div>

      {!configured && (
        <p className="rounded-lg border p-4">
          Supabase is not configured. Please check your .env.local file.
        </p>
      )}

      {error && (
        <p className="rounded-lg border border-red-300 p-4 text-red-700">
          Products could not be loaded. Please check your Supabase
          connection and database permissions.
        </p>
      )}

      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        configured &&
        !error && (
          <div className="rounded-lg border p-8 text-center">
            <h2 className="text-xl font-semibold">
              No products available yet
            </h2>
            <p className="mt-2 text-gray-600">
              Published products will appear here.
            </p>
          </div>
        )
      )}

      <Link href="/" className="mt-10 inline-block underline">
        Back to Home
      </Link>
    </main>
  );
}
