import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("manager123", 10);

  await prisma.user.create({
    data: {
      email: "manager@example.com",
      password: password,
      isActive: true,
      role: {
        connect: { name: "manager" },
      },
    },
  });
}

main();
