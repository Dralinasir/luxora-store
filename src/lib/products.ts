
import { createClient } from "@/lib/supabase/server";

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_minor: number;
  sale_price_minor: number | null;
  sku: string;
  status: string;
  featured: boolean;
  category_id: string | null;
  image_url: string | null;
  created_at: string;
  categories?: {
    name: string;
    slug: string;
  } | null;
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
      configured: false
    };
  }

  let query = supabase
    .from("products")
    .select(
      "id,name,slug,description,price_minor,sale_price_minor,sku,status,featured,category_id,image_url,created_at,categories(name,slug)"
    )
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(Math.min(Math.max(options.limit ?? 24, 1), 100));

  if (options.featured) {
    query = query.eq("featured", true);
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
    query = query.eq("categories.slug", options.category);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Product query failed:", error.message);

    return {
      products: [] as Product[],
      configured: true,
      error: true
    };
  }

  return {
    products: (data ?? []) as unknown as Product[],
    configured: true
  };
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient();

  if (!supabase) return null;

  const { data, error } = await supabase
    .from("products")
    .select(
      "id,name,slug,description,price_minor,sale_price_minor,sku,status,featured,category_id,image_url,created_at,categories(name,slug),product_images(id,url,alt_text,sort_order),product_variants(id,name,sku,price_minor,stock_quantity,attributes)"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("Product lookup failed:", error.message);
    return null;
  }

  return data;
}
