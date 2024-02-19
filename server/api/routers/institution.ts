import { db } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { institutionSchema } from "@/server/schema/institution";
import { z } from "zod";
import {updateUserParams} from "@/server/schema/user";

export const institutionRouter = createTRPCRouter({
  getInstitutions: protectedProcedure.query(async () => {
    return db.institution.findMany();
  }),

  createInstitution: protectedProcedure
  .input(institutionSchema).mutation(async ({ input: institution }) => {
    return db.institution.create({
      data: {
        ...institution
      }
    });
  }),
  updateInstitution: protectedProcedure
      .input(institutionSchema)
      .mutation(async ({ input: institution }) => {
        return db.institution.update({
          data: {
            ...institution
          },
          where: {
            id: institution.id,
          },
        });
      }),
  removeInstitution: protectedProcedure
  .input(institutionSchema.extend({ id: z.string() }).pick({id: true}))
  .mutation(async ({input: {id}})=>{
    return db.institution.delete({
      where: {
        id,
      }
    })
  })
});
