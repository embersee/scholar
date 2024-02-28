import { z } from "zod";
import { NonNullableFields } from "@/server/types";
import { RouterOutputs } from "@/trpc/shared";

export const userSchema = z.object({
  id: z.string().optional(),
  telegram_id: z.string(),
  username: z.string().optional(),
  display_name: z.string().optional(),
  FIO: z.string().optional(),
  email: z.string().optional(),
  phone_number: z.string().optional(),
  institutionId: z.string().optional(),
  specialty: z.string().optional(),
});

export const insertUserSchema = userSchema.extend({
  id: z.string(),
});

export const insertUserParams = userSchema.extend({
  id: z.string(),
});

export const updateUserSchema = userSchema.extend({
  telegram_id: z.string(),
});

export const userFormSchema = z.object({
  id: z.string().optional(),
  telegram_id: z.string(),
  username: z.string().optional(),
  display_name: z.string().optional(),
  FIO: z.string().min(3, "Обьязательное поле"),
  phone_number: z
    .string()
    .regex(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      "Не соотвествует формату номера телефона",
    )
    .min(1),
  email: z.string().email('Не соотвествует формату электронной почты')
  .min(1),
  institutionId: z.string().min(1, "Обьязательное поле"),
  specialty: z.string().min(1, "Обьязательное поле"),
});

export const updateUserParams = updateUserSchema.extend({});
export const userTelegramIdSchema = updateUserSchema.pick({
  telegram_id: true,
});

// Types for user - used to type API request params and within Components
export type User = z.infer<typeof updateUserSchema>;
export type NewUser = z.infer<typeof userSchema>;
export type NewUserParams = z.infer<typeof insertUserParams>;
export type UpdateUserParams = z.infer<typeof updateUserParams>;
export type CustomerId = z.infer<typeof userTelegramIdSchema>["telegram_id"];
export type UserForm = z.infer<typeof userFormSchema>;

export type GetUser = NonNullableFields<
  RouterOutputs["user"]["getAuthedUserWithInstitution"]
>;
