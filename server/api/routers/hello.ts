import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const helloRouter = createTRPCRouter({
  hello: publicProcedure.query(({ input }) => {
    return {
      greeting: `Hello from the server...`,
    };
  }),
});
