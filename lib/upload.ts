import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

/** Save an uploaded photo and return its public URL.
 *  Production (Vercel): Vercel Blob when BLOB_READ_WRITE_TOKEN is valid.
 *  Fallback (no Blob store connected, or token invalid): the photo is
 *  stored as a data URL in the database instead of failing the whole
 *  vehicle creation. The public site renders a data URL like any image.
 *  Local dev without a token: falls back to public/uploads/. */
export async function saveUpload(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  const filename = `${randomUUID()}-${safeName}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { put } = await import("@vercel/blob");
      const blob = await put(`veiculos/${filename}`, buffer, {
        access: "public",
        contentType: file.type || "image/jpeg",
      });
      return blob.url;
    } catch {
      // Blob store missing/invalid token: do NOT fail the vehicle save.
      // Fall through to the data-URL fallback below.
    }
  }

  if (process.env.NODE_ENV === "production") {
    const mime = file.type || "image/jpeg";
    return `data:${mime};base64,${buffer.toString("base64")}`;
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);
  return `/uploads/${filename}`;
}
