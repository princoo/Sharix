import { z } from "zod";

export const setUpPasswordSchema = z
  .object({
    monthlyShareCommitment: z
      .number()
      .min(1, "Monthly share commitment must be at least 1"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // <-- show the error at confirmPassword field
  });

export type setUpPasswordData = z.infer<typeof setUpPasswordSchema>;
