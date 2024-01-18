import {
  insertUserParams,
  updateUserParams,
  userTelegramIdSchema,
} from "@/server/schema/user";
import { createTRPCRouter, protectedProcedure } from "../trpc";

import { db } from "@/server/db";

export const userRouter = createTRPCRouter({
  getUsers: protectedProcedure.query(async () => {
    return db.user.findMany();
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

      if (isCurator) {
        return db.user.create({
          data: {
            ...user,
            role: "CURATOR",
            institution: {
              connect: {
                name: user.institution,
              },
            },
          },
        });
      }

      return db.user.create({
        data: {
          ...user,
          institution: {
            connect: {
              name: user.institution,
            },
          },
        },
      });
    }),

  updateUser: protectedProcedure
    .input(updateUserParams)
    .mutation(async ({ input: user }) => {
      return db.user.update({
        data: {
          ...user,
          institution: {
            connect: {
              name: user.institution,
            },
          },
        },
        where: {
          telegram_id: user.telegram_id,
        },
      });
    }),

  deleteUser: protectedProcedure
    .input(userTelegramIdSchema)
    .mutation(async ({ input: { telegram_id } }) => {
      return db.user.delete({
        where: {
          telegram_id,
        },
      });
    }),
});
