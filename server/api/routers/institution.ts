import { db } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const institutionRouter = createTRPCRouter({
  getInstitutions: protectedProcedure.query(async () => {
    return db.institution.findMany();
  }),
});
