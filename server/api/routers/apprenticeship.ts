import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

import { db } from "@/server/db";
import {
  apprenticeshipFormSchema,
  apprenticeshipSchema,
  apprenticeshipTypes,
} from "@/server/schema/apprenticeship";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const apprenticeshipRouter = createTRPCRouter({
  getApprenticeships: publicProcedure.query(async () => {
    return db.apprenticeship.findMany();
  }),
  getApprenticeshipsWithUsers: protectedProcedure.query(async () => {
    return db.apprenticeship.findMany({include: {user: true, curator:true, apprenticeship_type: true}});
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
        try {
        const { date, ...data } = {
          ...apprts,
          start_date: apprts.date.from,
          end_date: apprts.date.to,
        };
        
    const newApprenticeship = await db.apprenticeship.create({
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

    return newApprenticeship;
      }
      catch (error) {
        throw new TRPCError({ code: "BAD_REQUEST",
        message: "Error while creating, try again"
      });
      }
      },
    ),

  createApprtType: protectedProcedure
    .input(apprenticeshipTypes).mutation(async ({ input: apprtTypes }) => {
      try {
        const result = await db.apprenticeshipType.create({
          data: {
            ...apprtTypes
          }
        });
        return { success: true, result };
      } catch (error) {
        throw new TRPCError({ code: "BAD_REQUEST",
        message: "Error while creating, try again"
      });
      }
    }),

    removeApprtType: protectedProcedure
    .input(apprenticeshipTypes.extend({ id: z.string() }).pick({ id: true }))
    .mutation(async ({ input: { id } }) => {
      try {
        const result = await db.apprenticeshipType.delete({
          where: { id },
        });
        return { success: true, result };
      } catch (error) {
        throw new TRPCError({ code: "BAD_REQUEST",
        message: "Apprenticeship does not exist"
      });
      }
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
  
    updateApprenticeship: protectedProcedure
    .input(apprenticeshipTypes.extend({ id: z.string() }).pick({ id: true }))
    .mutation(async ({ input: apprt }) => {
      try {
        const result = await db.apprenticeship.update({
          data: {
            ...apprt
          },
          where: {
            id: apprt.id,
          },
        });
        return { success: true, result };
      } catch (error) {
        throw new TRPCError({ code: "BAD_REQUEST",
        message: "Apprenticeship does not exist"
      });
      }
    }),

  getTypes: protectedProcedure.query(async () => {
    return db.apprenticeshipType.findMany();
  }),
});
