import { z } from "zod";

export const memberProfileSchema = z.object({
  monthlyShareCommitment: z.number(),
  phoneNumber: z.string(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

export type MemberProfileData = z.infer<typeof memberProfileSchema>;
