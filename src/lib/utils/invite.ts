import jwt from "jsonwebtoken";

export function generateInviteToken(userId: string): string {
  const token = jwt.sign({ sub: userId }, process.env.AUTH_SECRET!, {
    expiresIn: "7d",
  });

  return token;
}

export function verifyInviteToken(token: string): { userId: string } {
  try {
    const decoded = jwt.verify(token, process.env.AUTH_SECRET!) as {
      sub: string;
    };

    return { userId: decoded.sub };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}
