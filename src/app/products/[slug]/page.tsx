
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/products/add-to-cart-button";
import { getProductBySlug } from "@/lib/products";
import { formatPKR } from "@/lib/config";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailsPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const price = product.price;
  const originalPrice = product.compare_at_price;

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <Link
        href="/products"
        className="mb-8 inline-block text-sm underline"
      >
        ← Back to all products
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="flex min-h-80 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full max-h-[550px] w-full object-contain"
            />
          ) : (
            <span className="text-2xl font-bold">LUXORA</span>
          )}
        </div>

        <div className="py-4">
          <p className="text-sm uppercase tracking-widest text-gray-500">
            {product.category}
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            {product.name}
          </h1>

          <div className="mt-5 flex items-center gap-3">
            <span className="text-2xl font-semibold">
              {formatPKR(price)}
            </span>

            {originalPrice !== null && originalPrice > price && (
              <del className="text-gray-500">
                {formatPKR(originalPrice)}
              </del>
            )}
          </div>

          <p className="mt-6 whitespace-pre-line text-gray-600">
            {product.description ||
              "A thoughtfully selected LUXORA essential."}
          </p>

          <p className="mt-5 text-sm">
            {product.stock > 0
              ? `In stock: ${product.stock}`
              : "Currently out of stock"}
          </p>

          <AddToCartButton product={product} />
        </div>
      </div>
    </main>
  );
}
