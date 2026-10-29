"use server";

import { compare } from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createSessionToken, getAdminEmail, SESSION_COOKIE } from "@/lib/auth";
import { brlToCents } from "@/lib/format";
import { saveUpload } from "@/lib/upload";

async function requireAdmin() {
  const email = await getAdminEmail();
  if (!email) redirect("/admin");
  return email;
}

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const ok =
    process.env.ADMIN_EMAIL &&
    email === process.env.ADMIN_EMAIL &&
    process.env.ADMIN_PASSWORD_HASH &&
    (await compare(password, process.env.ADMIN_PASSWORD_HASH));
  if (!ok) redirect("/admin?error=E-mail%20ou%20senha%20incorretos.");
  (await cookies()).set(SESSION_COOKIE, createSessionToken(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin");
}

function fields(formData: FormData) {
  return {
    model: String(formData.get("model") ?? "").trim(),
    year: Number(formData.get("year")),
    color: String(formData.get("color") ?? "").trim(),
    km: Number(String(formData.get("km") ?? "").replace(/\D/g, "")),
    fuel: String(formData.get("fuel") ?? "").trim(),
    transmission: String(formData.get("transmission") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    price: brlToCents(String(formData.get("price") ?? "")),
    description: String(formData.get("description") ?? "").trim(),
  };
}

export async function createVehicle(formData: FormData) {
  await requireAdmin();
  const photo = formData.get("photo") as File | null;
  const photoUrl = photo && photo.size > 0 ? await saveUpload(photo) : "/placeholders/suv.svg";
  const data = fields(formData);
  await prisma.vehicle.create({ data: { ...data, photoUrl } });
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateVehicle(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const photo = formData.get("photo") as File | null;
  const data = fields(formData);
  const photoUrl = photo && photo.size > 0 ? await saveUpload(photo) : undefined;
  await prisma.vehicle.update({ where: { id }, data: { ...data, ...(photoUrl ? { photoUrl } : {}) } });
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteVehicle(formData: FormData) {
  await requireAdmin();
  await prisma.vehicle.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function toggleSold(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const v = await prisma.vehicle.findUnique({ where: { id } });
  if (!v) return;
  await prisma.vehicle.update({
    where: { id },
    data: { status: v.status === "active" ? "sold" : "active" },
  });
  revalidatePath("/");
  revalidatePath("/admin");
}
