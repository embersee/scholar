import { createTRPCRouter } from "@/server/api/trpc";

import { helloRouter } from "./routers/hello";
import { userRouter } from "@/server/api/routers/user";
import {apprenticeshipRouter} from "@/server/api/routers/apprenticeship";

export const appRouter = createTRPCRouter({
  hello: helloRouter,
  user: userRouter,
  apprts: apprenticeshipRouter
});

export type AppRouter = typeof appRouter;
