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
  academic_year: z.coerce
    .string()
    .min(1, "Обьязательное поле")
    .max(2, "Превышено количество"),
  apprenticeship_type: z.string().min(1, "Обьязательное поле"),
  employment_status: z.boolean().optional(),
  attendance: z.boolean().optional(),
  signed: z.boolean().optional(),
  report_signed: z.boolean().optional(),
  referral_signed: z.boolean().optional(),
});

export const apprenticeshipFormSchema = apprenticeshipSchema
  .omit({
    user_id: true,
    referral_signed: true,
    employment_status: true,
    report_signed: true,
    signed: true,
    attendance: true,
    // referral: true,
    // report: true,
    curator: true,
    start_date: true,
    end_date: true,
  })
  .extend({
    date: z.object({ from: z.date(), to: z.date() }).required().strict(),
  });

export const apprenticeshipTypes = z.object({
  id: z.string(),
  name: z.string(),
});

export type Apprenticeship = z.infer<typeof apprenticeshipSchema>;
export type ApprenticeshipForm = z.infer<typeof apprenticeshipFormSchema>;
export type ApprenticeshipTypes = z.infer<typeof apprenticeshipTypes>;
export type GetApprenticeship = NonNullableFields<
  RouterOutputs["apprts"]["getApprenticeships"]
>;
