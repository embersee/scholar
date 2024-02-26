import { db } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { institutionSchema } from "@/server/schema/institution";
import { z } from "zod";
import {updateUserParams} from "@/server/schema/user";
import { TRPCError } from "@trpc/server";

export const institutionRouter = createTRPCRouter({
  getInstitutions: protectedProcedure.query(async () => {
    return db.institution.findMany();
  }),

  createInstitution: protectedProcedure
  .input(institutionSchema).mutation(async ({ input: institution }) => {  
    try {
      const result = await db.institution.create({
        data: {
          ...institution
        }
      });
      return { success: true, result };
    } catch (error) {
      throw new TRPCError({ code: "BAD_REQUEST",
      message: "Error while creating, try again"
    });
    }
  }),
  updateInstitution: protectedProcedure
      .input(institutionSchema)
      .mutation(async ({ input: institution }) => {
        try {
          const result = await db.institution.update({
            data: {
              ...institution
            },
            where: {
              id: institution.id,
            },
          });
          return { success: true, result };
        } catch (error) {
          throw new TRPCError({ code: "BAD_REQUEST",
          message: "Institution does not exist"
        });
        }
      }),
  removeInstitution: protectedProcedure
  .input(institutionSchema.extend({ id: z.string() }).pick({id: true}))
  .mutation(async ({input: {id}})=>{
    try {
      const result = await db.institution.delete({
        where: {
          id,
        }
      })
      return { success: true, result };
    } catch (error) {
      throw new TRPCError({ code: "BAD_REQUEST",
      message: "Institution does not exist"
    });
    }
  })
});
