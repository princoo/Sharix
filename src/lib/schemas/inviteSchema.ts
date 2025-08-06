import { z } from "zod";

export const invitesSchema = z.object({
  email: z.string().email().min(1, "Email is required"),
  role: z.string().min(1),
});

export type TaskFormData = z.infer<typeof invitesSchema>;
