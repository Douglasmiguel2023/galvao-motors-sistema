export function brl(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function brlToCents(value: string): number {
  const cleaned = value.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
  const n = Number(cleaned);
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

export function whatsappLink(v: {
  model: string;
  year: number;
  category: string;
  color: string;
  price: number;
  km: number;
  fuel: string;
  transmission: string;
}): string {
  const text = `Olá! Tenho interesse no veículo ${v.model} ${v.year} (${v.category}, ${v.color}, ${brl(v.price)}, ${v.km.toLocaleString("pt-BR")} km, ${v.fuel}, ${v.transmission}). Pode me passar mais informações?`;
  return `https://wa.me/5511966346931?text=${encodeURIComponent(text)}`;
}
