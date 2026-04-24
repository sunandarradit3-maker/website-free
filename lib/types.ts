export type Product = {
  id: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  image_url: string;
  status: "ready" | "sold out";
  created_at?: string;
  updated_at?: string;
};

export type PromoSettings = {
  promo_title: string;
  promo_subtitle: string;
  promo_active: boolean;
};
