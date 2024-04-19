import { env } from "@/env.mjs";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

import { db } from "@/server/db";
import {
  apprenticeshipFormSchema,
  apprenticeshipSchema,
  apprenticeshipTypes,
  updateApprenticeshipFormSchema,
  updateApprenticeshipParams, 
} from "@/server/schema/apprenticeship";
import type { Apprenticeship} from "@/server/schema/apprenticeship"
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const apprenticeshipRouter = createTRPCRouter({
  getApprenticeships: publicProcedure.query(async () => {
    return db.apprenticeship.findMany();
  }),
  getApprenticeshipsWithUsers: protectedProcedure.query(async () => {
    return db.apprenticeship.findMany({include: {user: true, curator:true, curatorGroup:true, apprenticeship_type: true}});
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
        const { date, apprenticeshipTypeId, ...data } = {
          ...apprts,
          start_date: apprts.date.from,
          end_date: apprts.date.to,
        
        };

    const hasActiveApprenticeships = !!(await db.apprenticeship.findFirst({
      where: {
        user: {
          telegram_id: user.id
        },
        report_signed: false,
      }
    }));

    if (hasActiveApprenticeships) {
      const checkError = new Error("Повторное создание");
      checkError.name = "checkError";
      throw checkError;
    }

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
            id: apprts.apprenticeshipTypeId,
          },
        },
      },
    });

   return  { success: true, newApprenticeship };
      }
      catch (error) {
        
        if (error instanceof Error) {
          if (error.name === "checkError") {
            throw new TRPCError({code: "BAD_REQUEST", 
              message: "У вас уже есть активная практика, сначала завершите ее ;)"
            })
          }
        }

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
    .input(updateApprenticeshipFormSchema)
    .mutation(async ({  input: apprt }) => {

      const { date, user_id, curatorId, curatorGroupId, apprenticeshipTypeId, ...data } = {
        ...apprt,
        start_date: apprt.date.from,
        end_date: apprt.date.to,
      };
      try {
        const curatorRecord = curatorId ? await db.curator.findUnique({ where: { id: apprt.curatorId } }) : null;
        const curatorGroupRecord = curatorGroupId ? await db.curatorGroups.findUnique({ where: { id: apprt.curatorGroupId } }) : null;
        const result = await db.apprenticeship.update({
          data: {...data,
          user: {
            connect: {
              id: apprt.user_id,
            },
          },
          apprenticeship_type: {
            connect: {
              id: apprt.apprenticeshipTypeId
            }
          },
          curator: curatorRecord ? { connect: { id: curatorRecord.id } } : undefined,
          curatorGroup: curatorGroupRecord ? { connect: { id: curatorGroupRecord.id } } : undefined,
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
  attendance: protectedProcedure
  .input(z.object({ id: z.string(), user_id: z.string(), attendance: z.boolean() }))
  .mutation( async ({  input: props} ) => {
    try {
      if (props.attendance) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "reported"
        });
      }
      const exists = await db.user.findFirst({
        where: { id: props.user_id },
      });

      if (!exists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User does not exist"
        });
      }

      const result = await db.apprenticeship.update({
        where: {
          id: props.id,
        },
        data: {
          attendance: true,
        },
      });
      const message = `Вашу заявку на прохождение практики подтвердили! По окончании практики отчёт необходимо загрузить по ссылке: https://auth.mkrit.ru `;
      await fetch(
        `https://api.telegram.org/bot${
          env.BOT_TOKEN
        }/sendMessage?chat_id=${exists.telegram_id}&text=${encodeURIComponent(
          message
        )}&parse_mode=HTML`
      );
      return { success: true, result };
    } catch (error) {
      throw new TRPCError({ code: "BAD_REQUEST",
      message: "Reported"
    });
    }
  }),
  signed: protectedProcedure
  .input(z.object({ id: z.string(), user_id: z.string() , signed: z.boolean()}))
  .mutation( async ({  input: props} ) => {
    try {
      if (props.signed) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "reported"
        });
      }
      const exists = await db.user.findFirst({
        where: { id: props.user_id },
      });

      if (!exists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User does not exist"
        });
      }

      const result = await db.apprenticeship.update({
        where: {
          id: props.id,
        },
        data: {
          signed: true,
        },
      });
      const message = `Вашу заявку на прохождение практики подтвердили! По окончании практики отчёт необходимо загрузить по ссылке: https://auth.mkrit.ru `;
      await fetch(
        `https://api.telegram.org/bot${
          env.BOT_TOKEN
        }/sendMessage?chat_id=${exists.telegram_id}&text=${encodeURIComponent(
          message
        )}&parse_mode=HTML`
      );
      return { success: true, result };
    } catch (error) {
      throw new TRPCError({ code: "BAD_REQUEST",
      message: "Reported"
    });
    }
  }),
  reportSigned: protectedProcedure
  .input(z.object({ id: z.string(), user_id: z.string(), report_signed: z.boolean()}))
  .mutation( async ({  input: props} ) => {
    try {
      if (props.report_signed) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "reported"
        });
      }
      const exists = await db.user.findFirst({
        where: { id: props.user_id },
      });

      if (!exists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User does not exist"
        });
      }

      const result = await db.apprenticeship.update({
        where: {
          id: props.id,
        },
        data: {
          report_signed: true,
        },
      });
      const message = `Ваш отчет по практике успешно подписан! Вы можете забрать его по адресу ул. Черняховского, 59 с понедельника по пятницу с 9:00 до 18:00 https://yandex.ru/maps/2/saint-petersburg/?ll=30.360200%2C59.920650&mode=poi&poi%5Bpoint%5D=30.359953%2C59.920658&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D1207571026&utm_source=share&z=21`;
      await fetch(
        `https://api.telegram.org/bot${
          env.BOT_TOKEN
        }/sendMessage?chat_id=${exists.telegram_id}&text=${encodeURIComponent(
          message
        )}&parse_mode=HTML`
      );
      return { success: true, result };
    } catch (error) {
      throw new TRPCError({ code: "BAD_REQUEST",
      message: "Reported"
    });
    }
  }),
  referralSigned: protectedProcedure
  .input(z.object({ id: z.string(), user_id: z.string(), referral_signed: z.boolean() }))
  .mutation( async ({  input: props} ) => {
    try {
      if (props.referral_signed) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "reported"
        });
      }
      const exists = await db.user.findFirst({
        where: { id: props.user_id },
      });

      if (!exists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User does not exist"
        });
      }
      const result = await db.apprenticeship.update({
        where: {
          id: props.id,
        },
        data: {
          referral_signed: true,
        },
      });
      const message = `Вашу заявку на прохождение практики подтвердили! По окончании практики отчёт необходимо загрузить по ссылке: https://auth.mkrit.ru `;
      await fetch(
        `https://api.telegram.org/bot${
          env.BOT_TOKEN
        }/sendMessage?chat_id=${exists.telegram_id}&text=${encodeURIComponent(
          message
        )}&parse_mode=HTML`
      );
      return { success: true, result };
    } catch (error) {
      throw new TRPCError({ code: "BAD_REQUEST",
      message: "Reported"
    });
    }
  }),
});
