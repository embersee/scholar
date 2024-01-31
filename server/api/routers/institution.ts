import { db } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { institutionSchema } from "@/server/schema/institution";
import { z } from "zod";

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
