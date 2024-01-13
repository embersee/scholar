import z from "zod";
import { RouterOutputs } from "@/trpc/shared";
import { NonNullableFields } from "@/server/types";

export const apprenticeshipSchema = z.object({
  user_id: z.string(),
  start_date: z.date(),
  end_date: z.date(),
  referral: z.string().optional(),
  report: z.string().optional(),
  curator: z.string().optional(),
  institution: z.string(),
  specialty: z.string(),
  academic_year: z.string(),
  apprenticeship_type: z.string(),
  employment_status: z.boolean().optional(),
  attendance: z.boolean().optional(),
  signed: z.boolean().optional(),
  report_signed: z.boolean().optional(),
  referral_signed: z.boolean().optional(),
});

export type Apprenticeship = z.infer<typeof apprenticeshipSchema>;

export type GetApprenticeships = NonNullableFields<
  RouterOutputs["apprts"]["getApprenticeships"]
>;
