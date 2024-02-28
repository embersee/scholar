import {
  insertUserParams,
  updateUserParams,
  updateUserSchema,
  userTelegramIdSchema,
} from "@/server/schema/user";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { env } from "@/env.mjs";

import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";
export const userRouter = createTRPCRouter({
  getUsers: protectedProcedure.query(async () => {
    return db.user.findMany({
    
    });
  }),
  getUsersWithInstitution: protectedProcedure.query(async () => {
    return db.user.findMany({
      include: {
        institution: true,
      },
    });
  }),
  getAuthedUserWithInstitution: protectedProcedure.query(
    async ({
      ctx: {
        session: { user },
      },
    }) => {
      return db.user.findFirst({
        where: {
          telegram_id: user.id,
        },
        include: {
          institution: true,
        },
      });
    },
  ),
  getAuthedUser: protectedProcedure.query(
    async ({
      ctx: {
        session: { user },
      },
    }) => {
      const data = db.user.findFirst({
        // select: {
        //   username: true,
        //   id: true,
        //   telegram_id: true,
        //   display_name: true,
        //   FIO: true,
        //   email: true,
        //   phone_number: true,
        //   institutionId: true,
        //   specialty: true,
        // },
        where: {
          telegram_id: user.id,
        },
      });

      return data;
    },
  ),
  getUserById: protectedProcedure
    .input(userTelegramIdSchema)
    .query(async ({ input: { telegram_id } }) => {
      return db.user.findFirst({
        where: {
          telegram_id,
        },
      });
    }),

  createUser: protectedProcedure
    .input(insertUserParams)
    .mutation(async ({ input: user }) => {
      const isCurator = await db.curator.findUnique({
        where: {
          telegram_id: user.telegram_id,
        },
      });
      const { institutionId, ...data } = user
      if (isCurator) {
        
        return db.user.create({
          data: {
            ...data,
            role: "CURATOR",
            institution: {
              connect: {
                name: user.institutionId,
              },
            },
          },
        });
      }

      return db.user.create({
        data: {
          ...data,
          institution: {
            connect: {
              name: user.institutionId,
            },
          },
        },
      });
    }),

  updateUser: protectedProcedure
    .input(updateUserSchema)
    .mutation(async ({ input: user }) => {
      try {
        const { institutionId, ...data } = user
        const result = await db.user.update({
          data: {
            ...data,
            institution: {
              connect: {
                id: user.institutionId,
              },
            },
          },
          where: {
            telegram_id: user.telegram_id,
          },
        });
        return { success: true, result };
      } catch (error) {
        throw new TRPCError({ code: "BAD_REQUEST",
        message: "Apprenticeship does not exist"
      });
      }
    }),

  deleteUser: protectedProcedure
    .input(userTelegramIdSchema)
    .mutation(async ({ input: { telegram_id } }) => {
          const exists = await db.user.findFirst({
            where: { telegram_id: telegram_id },
          });

          if (!exists) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Пользователя не существует",
            });
          }
          const message = `Добрый день ${exists.FIO}, ваша заявка в ИАЦ была отвержена, вероятно надо обновить и заполнить данные опять.`;
          fetch(
            `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage?chat_id=${telegram_id}&text=${message}&parse_mode=HTML`
          );

       
      return db.user.delete({
        where: {
          telegram_id,
        },
      });
    }),
});
