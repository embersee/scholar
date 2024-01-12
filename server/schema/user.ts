import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  telegram_id: z.string(),
  username: z.string().optional(),
  display_name: z.string().optional(),
  FIO: z.string().optional(),
  phone_number: z.string().optional()
});

export const insertUserSchema = userSchema.extend({
  id: z.string(),
});

export const insertUserParams = userSchema.extend({
  id: z.string(),
});

export const updateUserSchema = userSchema.extend({
  id: z.string(),
});

export const updateUserParams = updateUserSchema.extend({});
export const userTelegramIdSchema = updateUserSchema.pick({ telegram_id: true });

// Types for user - used to type API request params and within Components
export type User = z.infer<typeof updateUserSchema>;
export type NewCustomer = z.infer<typeof userSchema>;
export type NewCustomerParams = z.infer<typeof insertUserParams>;
export type UpdateCustomerParams = z.infer<typeof updateUserParams>;
export type CustomerId = z.infer<typeof userTelegramIdSchema>["telegram_id"];
