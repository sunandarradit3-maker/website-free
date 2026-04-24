import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const admins = (process.env.ALLOWED_ADMIN_EMAILS || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);

export async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");
  if (admins.length && !admins.includes(user.email?.toLowerCase() || "")) redirect("/admin/login");

  return user;
}
