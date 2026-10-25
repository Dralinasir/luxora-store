
import { createClient } from "@/lib/supabase/server";

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  category: string;
  image_url: string | null;
  stock: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type ProductOptions = {
  limit?: number;
  featured?: boolean;
  search?: string;
  category?: string;
};

export async function getProducts(options: ProductOptions = {}) {
  const supabase = await createClient();

  if (!supabase) {
    return {
      products: [] as Product[],
      configured: false,
    };
  }

  let query = supabase
    .from("products")
    .select(
      "id,name,slug,description,price,compare_at_price,category,image_url,stock,is_featured,is_active,created_at,updated_at"
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(Math.min(Math.max(options.limit ?? 24, 1), 100));

  if (options.featured) {
    query = query.eq("is_featured", true);
  }

  if (options.search?.trim()) {
    const search = options.search
      .trim()
      .replace(/[,%()]/g, "")
      .slice(0, 100);

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }
  }

  if (options.category) {
    query = query.eq("category", options.category);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Product query failed:", error.message);

    return {
      products: [] as Product[],
      configured: true,
      error: true,
    };
  }

  return {
    products: (data ?? []) as Product[],
    configured: true,
  };
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient();

  if (!supabase) return null;

  const { data, error } = await supabase
    .from("products")
    .select(
      "id,name,slug,description,price,compare_at_price,category,image_url,stock,is_featured,is_active,created_at,updated_at"
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("Product lookup failed:", error.message);
    return null;
  }

  return data as Product | null;
}
