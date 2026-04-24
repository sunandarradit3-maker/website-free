import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Product, PromoSettings } from "@/lib/types";

export const getHomeData = cache(async () => {
  const supabase = await createClient();
  const [productsRes, promoRes] = await Promise.all([
    supabase.from("products").select("*").eq("status", "ready").order("created_at", { ascending: false }).limit(8),
    supabase.from("site_settings").select("promo_title,promo_subtitle,promo_active").eq("id", 1).single()
  ]);

  return {
    products: (productsRes.data || []) as Product[],
    promo: promoRes.data?.promo_active ? promoRes.data : null
  };
});

export async function getProducts(params?: { q?: string; category?: string; status?: string }) {
  const supabase = await createClient();
  let query = supabase.from("products").select("*").order("created_at", { ascending: false });

  if (params?.status && params.status !== "all") query = query.eq("status", params.status);
  if (params?.category && params.category !== "all") query = query.eq("category", params.category);
  if (params?.q) query = query.ilike("title", `%${params.q}%`);

  const { data } = await query;
  return (data || []) as Product[];
}

export async function getProductById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("*").eq("id", id).single();
  return (data || null) as Product | null;
}

export async function getAdminStats() {
  const supabase = createAdminClient();
  const [{ count: products }, { count: orders }, { count: messages }] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("order_events").select("*", { count: "exact", head: true }),
    supabase.from("messages").select("*", { count: "exact", head: true })
  ]);

  return [
    { label: "products", value: products || 0 },
    { label: "orders", value: orders || 0 },
    { label: "messages", value: messages || 0 },
    { label: "status", value: "live" }
  ];
}

export async function getAdminProducts(editId?: string) {
  const supabase = createAdminClient();
  const { data: products } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  let selected = null as Product | null;
  if (editId) {
    const { data } = await supabase.from("products").select("*").eq("id", editId).single();
    selected = (data || null) as Product | null;
  }
  return { products: (products || []) as Product[], selected };
}

export async function getOrders() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("order_events").select("*").order("created_at", { ascending: false }).limit(100);
  return (data || []) as Array<any>;
}

export async function getPromoSettings() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("site_settings").select("promo_title,promo_subtitle,promo_active").eq("id", 1).single();
  return data as PromoSettings | null;
}
