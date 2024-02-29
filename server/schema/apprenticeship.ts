import z from "zod";
import { RouterOutputs } from "@/trpc/shared";
import { NonNullableFields } from "@/server/types";

export const apprenticeshipSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  start_date: z.date(),
  end_date: z.date(),
  referral: z.string().optional(),
  report: z.string().optional(),
  curatorId: z.string().optional(),
  curatorGroupId: z.string().optional(),
  academic_year: z.coerce
    .string()
    .min(1, "Обьязательное поле")
    .max(2, "Превышено количество"),
  apprenticeshipTypeId: z.string(),
  employment_status: z.boolean().optional(),
  attendance: z.boolean().optional(),
  signed: z.boolean().optional(),
  report_signed: z.boolean().optional(),
  referral_signed: z.boolean().optional(),
});

export const apprenticeshipFormSchema = apprenticeshipSchema
  .omit({
    id: true,
    user_id: true,
    referral_signed: true,
    employment_status: true,
    report_signed: true,
    signed: true,
    attendance: true,
    // referral: true,
    // report: true,
    // apprenticeshipTypeId: true,
    curatorId: true,
    curatorGroupId: true,
    start_date: true,
    end_date: true,
  })
  .extend({
    date: z.object({ from: z.date(), to: z.date() }).required().strict(),
  });

export const apprenticeshipTypes = z.object({
  id: z.string().optional(),
  name: z.string().min(1,'Обязательное поле'),
});


export const updateApprenticeshipParams = apprenticeshipSchema.extend({});

export type Apprenticeship = z.infer<typeof apprenticeshipSchema>;
export type ApprenticeshipForm = z.infer<typeof apprenticeshipFormSchema>;
export type ApprenticeshipTypes = z.infer<typeof apprenticeshipTypes>;
export type GetApprenticeship = NonNullableFields<
  RouterOutputs["apprts"]["getApprenticeships"]
>;
