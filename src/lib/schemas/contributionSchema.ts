import { z } from "zod";

export const contributionSchema = z.object({
  month: z
    .string()
    .refine(
      (date) => {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Matches YYYY-MM-DD
        return dateRegex.test(date);
      },
      {
        message: "Please enter a valid date in YYYY-MM-DD format",
      }
    )
    .transform((date) => new Date(date)),
  amountPaid: z.string(),
  proof: z
    .instanceof(File)
    .refine((file) => file.type.startsWith("image/"), {
      message: "Proof must be an image",
    })
    .optional(),
});

export const contributionSummarySchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Month must be in YYYY-MM format")
    .transform((val) => {
      // Convert YYYY-MM to YYYY-MM-01T00:00:00.000Z
      return new Date(`${val}-01T00:00:00.000Z`);
    }),
});

export type ContributionData = z.infer<typeof contributionSchema>;
