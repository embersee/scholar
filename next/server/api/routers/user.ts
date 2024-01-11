import {
  insertUserParams,
  updateUserParams,
  userTelegramIdSchema,
} from "@/server/schema/user";
import { createTRPCRouter, protectedProcedure } from "../trpc";

import { db } from "@/server/db";

export const userRouter = createTRPCRouter({
  getCustomers: protectedProcedure.query(async () => {
    return db.user.findMany();
  }),

  getCustomerById: protectedProcedure
    .input(userTelegramIdSchema)
    .query(async ({ input: { telegram_id } }) => {
      return db.user.findFirst({
        where: {
          telegram_id,
        },
      });
    }),

  createCustomer: protectedProcedure
    .input(insertUserParams)
    .mutation(async ({ input: user }) => {
      return db.user.create({
        data: user,
      });
    }),

  updateCustomer: protectedProcedure
    .input(updateUserParams)
    .mutation(async ({ input: user }) => {
      return db.user.update({
        data: user,
        where: {
          telegram_id: user.telegram_id,
        },
      });
    }),

  deleteCustomer: protectedProcedure
    .input(userTelegramIdSchema)
    .mutation(async ({ input: { telegram_id } }) => {
      return db.user.delete({
        where: {
          telegram_id,
        },
      });
    }),
});
