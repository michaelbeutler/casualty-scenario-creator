import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const symptoms = [
  {
    name: "Brustschmerzen",
    description: "Brustschmerzen",
  },
  {
    name: "Kopfschmerzen",
    description: "Kopfschmerzen",
  },
  {
    name: "Fieber",
    description: "Fieber",
  },
  {
    name: "Husten",
    description: "Husten",
  },
  {
    name: "Atemnot",
    description: "Atemnot",
  },
  {
    name: "Gliederschmerzen",
    description: "Gliederschmerzen",
  },
];

const mechanisms = [
  {
    name: "GSW",
    description: "Gunshot Wound",
  },
];

async function main() {
  for (const symptom of symptoms) {
    await prisma.symptom.upsert({
      where: { name: symptom.name },
      update: {},
      create: {
        ...symptom,
      },
    });
  }

  for (const mechanism of mechanisms) {
    await prisma.mechanismOfInjury.upsert({
      where: { name: mechanism.name },
      update: {},
      create: {
        ...mechanism,
      },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit();
  });
