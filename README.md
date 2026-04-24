# DiTz Store

ecommerce premium berbasis Next.js App Router + Tailwind CSS + Supabase.

## fitur
- homepage premium
- katalog produk + search + filter
- detail produk
- wishlist button
- whatsapp order
- telegram order
- contact form
- admin login
- dashboard
- produk CRUD
- promo banner editor
- order log dan messages
- responsive dan SEO-ready

## setup
1. buat project supabase
2. jalankan `supabase/schema.sql`
3. isi `.env.local` dari `.env.example`
4. install deps: `npm install`
5. run: `npm run dev`

## catatan
- admin route dilindungi oleh session + allowlist email di `ALLOWED_ADMIN_EMAILS`
- upload gambar masuk bucket `product-images`
- WhatsApp buka chat ke `087739435496`
- Telegram buka `@raditsunandar`
