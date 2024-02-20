import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

import { db } from "@/server/db";
import {
  apprenticeshipFormSchema,
  apprenticeshipSchema,
  apprenticeshipTypes,
} from "@/server/schema/apprenticeship";
import { z } from "zod";

export const apprenticeshipRouter = createTRPCRouter({
  getApprenticeships: publicProcedure.query(async () => {
    return db.apprenticeship.findMany();
  }),
  getApprenticeshipsWithUsers: protectedProcedure.query(async () => {
    return db.apprenticeship.findMany({include: {user: true, apprenticeship_type: true}});
  }),


  getApprenticeshipsById: protectedProcedure
    .input(apprenticeshipSchema.pick({ user_id: true }))
    .query(async ({ input: { user_id } }) => {
      return db.apprenticeship.findFirst({
        where: {
          user_id,
        },
      });
    }),

  createApprenticeship: protectedProcedure
    .input(apprenticeshipFormSchema)
    .mutation(
      async ({
        input: apprts,
        ctx: {
          session: { user },
        },
      }) => {
        const { date, ...data } = {
          ...apprts,
          start_date: apprts.date.from,
          end_date: apprts.date.to,
        };

        return db.apprenticeship.create({
          data: {
            ...data,
            user: {
              connect: {
                telegram_id: user.id,
              },
            },
            apprenticeship_type: {
              connect: {
                id: data.apprenticeship_type,
              },
            },
          },
        });
      },
    ),

  createApprtType: protectedProcedure
    .input(apprenticeshipTypes).mutation(async ({ input: apprtTypes }) => {
      return db.apprenticeshipType.create({
        data: {
          ...apprtTypes
        }
      });
    }),

  removeApprtType: protectedProcedure
    .input(apprenticeshipTypes.extend({ id: z.string() }).pick({ id: true }))
    .mutation(async ({ input: { id } }) => {
      return db.apprenticeshipType.delete({
        where: { id, }
      })
    }),

  deleteApprenticeship: protectedProcedure
    .input(apprenticeshipSchema.extend({ id: z.string() }).pick({ id: true }))
    .mutation(async ({ input: { id } }) => {
      return db.apprenticeship.delete({
        where: {
          id,
        },
      });
    }),

  getTypes: protectedProcedure.query(async () => {
    return db.apprenticeshipType.findMany();
  }),
});
