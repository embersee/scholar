import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "@/server/api/trpc";
import {db} from "@/server/db";
import { curatorSchema, insertCuratorSchema, updateCuratorSchema} from "@/server/schema/curator";
import { TRPCError } from "@trpc/server";


export const curatorRouter = createTRPCRouter({
    getCurators: protectedProcedure.query(async () => {
        return db.curator.findMany({ 
            select: {
                id: true,
                telegram_id: true,
                FIO: true,
                group_links: {
                    select: {
                        id: true,
                        group_name: true,
                        group_link: true,
                    }
                }
            }, 
        });
    }),

    createCurator: protectedProcedure
        .input(insertCuratorSchema)
        .mutation(
            async ({
                       input: curator,
                       ctx: {
                           session: { user },
                       },
                   }) => {
                try {
                    const result = await db.curator.create({
                        data: {
                            ...curator,
                            group_links: {
                                create: curator.group_links,
                            }
                        }
                    });
                    return { success: true, result };
                  } catch (error) {
                    throw new TRPCError({ code: "BAD_REQUEST",
                    message: "Error while creating, try again"
                  });
                  }
            },
        ),

    updateCurator: protectedProcedure
        .input(updateCuratorSchema)
        .mutation(async ({ input: curator }) => {
            try {
                const result = await db.curator.update({
                    where: {
                        id: curator.id,
                    },
                    data: {
                        ...curator,
                        group_links: {
                            deleteMany: {},
                            create: curator.group_links.map((el) => {
                                return el;
                            }),
                        }
                    },
                });
                return { success: true, result };
              } catch (error) {
                throw new TRPCError({ code: "BAD_REQUEST",
                message: "Curator does not exist"
              });
              }
        }),
    removeCurator: protectedProcedure
        .input(curatorSchema.extend({ id: z.string() }).pick({id: true}))
        .mutation(async ({input: {id}})=>{          
            try {
                const result = await db.curator.delete({
                    where: {
                        id,
                    },
                    include: {
                        group_links: true,
                    }
                })
                return { success: true, result };
              } catch (error) {
                throw new TRPCError({ code: "BAD_REQUEST",
                message: "Curator does not exist"
              });
              }
        })
});
