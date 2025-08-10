import { z } from "zod";

export const createShareSettingSchema = z.object({
  sharePrice: z
    .string()
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, {
      message: "Share price must be a positive number",
    }),
  activeFrom: z
    .string()
    .refine((date) => /^\d{4}-\d{2}-\d{2}$/.test(date), {
      message: "Date must be in YYYY-MM-DD format",
    })
    .transform((date) => new Date(date)),
});

export const updateShareSettingSchema = createShareSettingSchema.partial();
