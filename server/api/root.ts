import { createTRPCRouter } from "@/server/api/trpc";

import { helloRouter } from "./routers/hello";
import { userRouter } from "@/server/api/routers/user";
import { apprenticeshipRouter } from "@/server/api/routers/apprenticeship";
import { institutionRouter } from "@/server/api/routers/institution";
import {curatorRouter} from "@/server/api/routers/curators";

export const appRouter = createTRPCRouter({
  hello: helloRouter,
  user: userRouter,
  apprts: apprenticeshipRouter,
  institutions: institutionRouter,
  curators: curatorRouter,
});

export type AppRouter = typeof appRouter;
