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
  // Password check, in order: bcrypt hash (ADMIN_PASSWORD_HASH) or plain
  // env password (ADMIN_PASSWORD). The plain option exists because hash
  // generation kept failing for the owner; it is still server-side only
  // (Vercel env vars, never in code) and must be a unique password.
  let passwordOk = false;
  if (process.env.ADMIN_PASSWORD_HASH) {
    try {
      passwordOk = await compare(password, process.env.ADMIN_PASSWORD_HASH);
    } catch {
      passwordOk = false;
    }
  }
  if (!passwordOk && process.env.ADMIN_PASSWORD) {
    passwordOk = password.length > 0 && password === process.env.ADMIN_PASSWORD;
  }
  const ok =
    process.env.ADMIN_EMAIL &&
    email === process.env.ADMIN_EMAIL &&
    passwordOk;
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
  let photoUrl = "/placeholders/suv.svg";
  if (photo && photo.size > 0) {
    try {
      photoUrl = await saveUpload(photo);
    } catch {
      // Vercel Blob token inválido/ausente: em vez de "Application error"
      // genérico, volta ao painel com a causa legível.
      redirect("/admin?error=Falha%20no%20upload%20da%20foto%3A%20o%20token%20do%20Vercel%20Blob%20(BLOB_READ_WRITE_TOKEN)%20est%C3%A1%20inv%C3%A1lido.%20Conecte%20a%20loja%20Blob%20ao%20projeto%20na%20Vercel%20e%20fa%C3%A7a%20redeploy.");
    }
  }
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
