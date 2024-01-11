import { createTRPCRouter } from "@/server/api/trpc";

import { helloRouter } from "./routers/hello";
import { userRouter } from "@/server/api/routers/user";

export const appRouter = createTRPCRouter({
  hello: helloRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
