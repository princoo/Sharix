import { auth } from "../../../auth";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../db";
import { LoginInput } from "../schemas/authSchema";

export const getServerSessionUSer = async () => {
  const session = await auth();
  return session?.user;
};

export async function loginService(data: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
    include: { role: true },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }
  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.password ?? ""
  );
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role.name },
    process.env.JWT_SECRET as string,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role.name,
    },
  };
}
