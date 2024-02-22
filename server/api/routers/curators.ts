import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "@/server/api/trpc";
import {db} from "@/server/db";
import {Curator, curatorSchema, curatorSchemaUpdate} from "@/server/schema/curator";


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
        .input(curatorSchema)
        .mutation(
            async ({
                       input: curator,
                       ctx: {
                           session: { user },
                       },
                   }) => {
                return db.curator.create({
                    data: {
                        ...curator,
                        group_links: {
                            create: curator.group_links,
                        }
                    }
                });
            },
        ),

    updateCurator: protectedProcedure
        .input(curatorSchemaUpdate)
        .mutation(async ({ input: curator }) => {
            return db.curator.update({
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
        }),
    removeCurator: protectedProcedure
        .input(curatorSchema.extend({ id: z.string() }).pick({id: true}))
        .mutation(async ({input: {id}})=>{
            return db.curator.delete({
                where: {
                    id,
                },
                include: {
                    group_links: true,
                }
            })
        })
});
