// Seed: 4 CLEARLY FICTITIOUS example vehicles (one per category).
// The admin can delete them from /admin. No real inventory is hardcoded here.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const vehicles = [
  { model: "Exemplo SUV Azul 2023", year: 2023, color: "Azul", km: 32000, fuel: "Flex", transmission: "Automático", category: "SUV", price: 11990000, photoUrl: "/placeholders/suv.svg", description: "Veículo EXEMPLO fictício — pode ser excluído no painel.", status: "active" },
  { model: "Exemplo Sedã Cinza 2022", year: 2022, color: "Cinza", km: 45000, fuel: "Flex", transmission: "Automático", category: "sedã", price: 8990000, photoUrl: "/placeholders/sedan.svg", description: "Veículo EXEMPLO fictício — pode ser excluído no painel.", status: "active" },
  { model: "Exemplo Hatch Branco 2021", year: 2021, color: "Branco", km: 58000, fuel: "Flex", transmission: "Manual", category: "hatch", price: 6490000, photoUrl: "/placeholders/hatch.svg", description: "Veículo EXEMPLO fictício — pode ser excluído no painel.", status: "active" },
  { model: "Exemplo Picape Vermelha 2023", year: 2023, color: "Vermelho", km: 28000, fuel: "Diesel", transmission: "Automático", category: "picape", price: 13990000, photoUrl: "/placeholders/picape.svg", description: "Veículo EXEMPLO fictício — pode ser excluído no painel.", status: "active" },
];

for (const v of vehicles) {
  await prisma.vehicle.upsert({
    where: { id: `seed-${v.category}` },
    update: v,
    create: { id: `seed-${v.category}`, ...v },
  });
}
console.log(`Seeded ${vehicles.length} example vehicles.`);
await prisma.$disconnect();
