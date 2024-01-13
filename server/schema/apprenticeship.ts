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
  institution: z.string().min(1, "Обьязательное поле"),
  specialty: z.string().min(1, "Обьязательное поле"),
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
    referral: true,
    report: true,
    curator: true,
    start_date: true,
    end_date: true,
  })
  .extend({
    FIO: z.string().min(3, "Обьязательное поле"),
    phone_number: z
      .string()
      .regex(
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
        "Не соотвествует формату номера телефона",
      )
      .min(0),
    date: z.object({ from: z.date(), to: z.date() }).required().strict(),
  });

export type Apprenticeship = z.infer<typeof apprenticeshipSchema>;
export type ApprenticeshipForm = z.infer<typeof apprenticeshipFormSchema>;

export type GetApprenticeships = NonNullableFields<
  RouterOutputs["apprts"]["getApprenticeships"]
>;
