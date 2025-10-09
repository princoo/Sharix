import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const roles = ["manager", "member", "board"];
  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: { name: role },
    });
  }
}

main()
  /* eslint-disable no-console */
  .then(() => console.log("Seeding complete"))
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
