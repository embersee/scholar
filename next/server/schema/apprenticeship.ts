import z from "zod";

export const ApprenticeshipSchema = z.object({
  telegram_id: z.string(),
  FIO: z.string(),
  start_date: z.date(),
  end_date: z.date(),
  referral: z.string(),
  report: z.string(),
  curator: z.string(),
  institution: z.string(),
  specialty: z.string(),
  academic_year: z.string(),
  apprenticeship_type: z.string(),
  employment_status: z.boolean(),
  attendance: z.boolean(),
  signed: z.boolean(),
  report_signed: z.boolean(),
  referral_signed: z.boolean(),
});
