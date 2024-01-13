import { db } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

// export const userRouter = createTRPCRouter({
//   getInstitutions: protectedProcedure.query(async () => {
//     return db.institutions.findMany();
//   }),
// });
// Here
