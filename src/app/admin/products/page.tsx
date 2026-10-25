
"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  category: string | null;
  image_url: string | null;
  stock: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
};

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  price: "",
  compare_at_price: "",
  category: "",
  image_url: "",
  stock: "0",
  is_featured: false,
  is_active: true,
};

type ProductForm = typeof emptyForm;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/products", {
        cache: "no-store",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Products load nahi hue.");
      }

      setProducts(result.products ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Products load nahi hue."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  function updateField<K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K]
  ) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function makeSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function editProduct(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description ?? "",
      price: String(product.price),
      compare_at_price:
        product.compare_at_price == null
          ? ""
          : String(product.compare_at_price),
      category: product.category ?? "",
      image_url: product.image_url ?? "",
      stock: String(product.stock),
      is_featured: product.is_featured,
      is_active: product.is_active,
    });

    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || null,
        price: Number(form.price),
        compare_at_price:
          form.compare_at_price.trim() === ""
            ? null
            : Number(form.compare_at_price),
        category: form.category.trim() || null,
        image_url: form.image_url.trim() || null,
        stock: Number(form.stock),
        is_featured: form.is_featured,
        is_active: form.is_active,
      };

      if (
        !payload.name ||
        !payload.slug ||
        form.price.trim() === "" ||
        !Number.isFinite(payload.price) ||
        payload.price < 0 ||
        !Number.isInteger(payload.stock) ||
        payload.stock < 0 ||
        (payload.compare_at_price !== null &&
          (!Number.isFinite(payload.compare_at_price) ||
            payload.compare_at_price < 0))
      ) {
        throw new Error("Product ki details aur prices check karein.");
      }

      const response = await fetch("/api/products", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingId ? { id: editingId, ...payload } : payload
        ),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Product save nahi hua.");
      }

      setMessage(
        editingId
          ? "Product successfully update ho gaya!"
          : "Product successfully add ho gaya!"
      );

      resetForm();
      await loadProducts();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Product save nahi hua."
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(product: Product) {
    setBusyId(product.id);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          is_active: !product.is_active,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Product status update nahi hua.");
      }

      setMessage(
        product.is_active
          ? "Product inactive kar diya gaya."
          : "Product active kar diya gaya."
      );

      await loadProducts();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Status update nahi hua."
      );
    } finally {
      setBusyId(null);
    }
  }

  async function deleteProduct(product: Product) {
    const confirmed = window.confirm(
      `Kya aap "${product.name}" ko permanently delete karna chahte hain?`
    );

    if (!confirmed) return;

    setBusyId(product.id);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/products?id=${encodeURIComponent(product.id)}`,
        { method: "DELETE" }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Product delete nahi hua.");
      }

      if (editingId === product.id) resetForm();

      setMessage("Product successfully delete ho gaya.");
      await loadProducts();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Product delete nahi hua."
      );
    } finally {
      setBusyId(null);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-lg border border-neutral-300 px-3 py-3 font-normal outline-none focus:border-black";

  return (
    <main className="min-h-screen bg-white px-4 py-8 text-black sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
              LUXORA ADMIN
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Products
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              Apne store ke products manage karein.
            </p>
          </div>

          <div className="rounded-xl border border-black/10 px-5 py-3">
            <p className="text-xs text-neutral-500">Total products</p>
            <p className="text-2xl font-bold">{products.length}</p>
          </div>
        </header>

        {message && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="mb-10 rounded-2xl border border-black/10 p-5 sm:p-7">
          <h2 className="mb-6 text-xl font-semibold">
            {editingId ? "Edit product" : "Add new product"}
          </h2>

          <form onSubmit={saveProduct} className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-medium">
              Product name *
              <input
                required
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setForm((previous) => ({
                    ...previous,
                    name,
                    slug:
                      editingId && previous.slug !== makeSlug(previous.name)
                        ? previous.slug
                        : makeSlug(name),
                  }));
                }}
                className={inputClass}
                placeholder="Classic Backpack"
              />
            </label>

            <label className="text-sm font-medium">
              Product slug *
              <input
                required
                value={form.slug}
                onChange={(e) => updateField("slug", makeSlug(e.target.value))}
                className={inputClass}
                placeholder="classic-backpack"
              />
            </label>

            <label className="text-sm font-medium">
              Price (Rs.) *
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                className={inputClass}
                placeholder="2499"
              />
            </label>

            <label className="text-sm font-medium">
              Compare-at price (Rs.)
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.compare_at_price}
                onChange={(e) =>
                  updateField("compare_at_price", e.target.value)
                }
                className={inputClass}
                placeholder="2999"
              />
            </label>

            <label className="text-sm font-medium">
              Category
              <input
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                className={inputClass}
                placeholder="Accessories"
              />
            </label>

            <label className="text-sm font-medium">
              Stock quantity *
              <input
                required
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={(e) => updateField("stock", e.target.value)}
                className={inputClass}
              />
            </label>

            <label className="text-sm font-medium sm:col-span-2">
              Image URL
              <input
                type="url"
                value={form.image_url}
                onChange={(e) => updateField("image_url", e.target.value)}
                className={inputClass}
                placeholder="https://example.com/product.jpg"
              />
            </label>

            <label className="text-sm font-medium sm:col-span-2">
              Description
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                className={inputClass}
                placeholder="Product details..."
              />
            </label>

            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) =>
                  updateField("is_featured", e.target.checked)
                }
                className="h-4 w-4 accent-black"
              />
              Featured product
            </label>

            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => updateField("is_active", e.target.checked)}
                className="h-4 w-4 accent-black"
              />
              Active on store
            </label>

            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update product"
                    : "Add product"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="rounded-lg border border-neutral-300 px-6 py-3 text-sm font-semibold hover:bg-neutral-50"
                >
                  Cancel edit
                </button>
              )}
            </div>
          </form>
        </section>

        <section>
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">All products</h2>
            <button
              onClick={() => void loadProducts()}
              disabled={loading}
              className="rounded-lg border border-black/15 px-4 py-2 text-sm hover:bg-neutral-50 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {loading ? (
            <p className="py-8 text-sm text-neutral-500">
              Loading products...
            </p>
          ) : products.length === 0 ? (
            <p className="rounded-xl border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500">
              Abhi koi product nahi mila.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-black/10">
              <table className="w-full min-w-[1000px] text-left text-sm">
                <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
                  <tr>
                    <th className="px-4 py-4">Product</th>
                    <th className="px-4 py-4">Category</th>
                    <th className="px-4 py-4">Price</th>
                    <th className="px-4 py-4">Stock</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-black/5">
                  {products.map((product) => {
                    const busy = busyId === product.id;

                    return (
                      <tr key={product.id} className="hover:bg-neutral-50/70">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="h-12 w-12 rounded-lg border border-black/10 object-cover"
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 text-xs text-neutral-400">
                                No img
                              </div>
                            )}

                            <div>
                              <p className="font-semibold">{product.name}</p>
                              <p className="mt-1 text-xs text-neutral-500">
                                {product.slug}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          {product.category || "—"}
                        </td>

                        <td className="px-4 py-4 font-medium">
                          Rs. {Number(product.price).toLocaleString("en-PK")}
                        </td>

                        <td className="px-4 py-4">{product.stock}</td>

                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              product.is_active
                                ? "bg-green-50 text-green-700"
                                : "bg-neutral-100 text-neutral-600"
                            }`}
                          >
                            {product.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => editProduct(product)}
                              disabled={busy || saving}
                              className="rounded-md border border-neutral-300 px-3 py-2 text-xs font-semibold hover:bg-neutral-100 disabled:opacity-50"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => void toggleActive(product)}
                              disabled={busy || saving}
                              className="rounded-md border border-neutral-300 px-3 py-2 text-xs font-semibold hover:bg-neutral-100 disabled:opacity-50"
                            >
                              {busy
                                ? "Please wait..."
                                : product.is_active
                                  ? "Deactivate"
                                  : "Activate"}
                            </button>

                            <button
                              type="button"
                              onClick={() => void deleteProduct(product)}
                              disabled={busy || saving}
                              className="rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
