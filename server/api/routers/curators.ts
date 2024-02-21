import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "@/server/api/trpc";
import {db} from "@/server/db";
import {Curator, curatorSchema, curatorSchemaUpdate} from "@/server/schema/curator";
import {institutionSchema} from "@/server/schema/institution";

export const curatorRouter = createTRPCRouter({

    getCurators: protectedProcedure.query(async () => {
        return db.curator.findMany({
            include: {
                group_links: true,
            },
        }) as unknown as Curator[];
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
                const data1 = curator as any;


                return db.curator.create({
                    data: {
                        ...data1,
                        group_links: {
                            deleteMany: {
                                curatorId: data1.id
                            },
                            create: curator.group_links.map((el: any) => {
                                const newEl = {...el};
                                delete newEl.curatorId;
                                return newEl;
                            })
                        }
                    }
                });
            },
        ),

    updateCurator: protectedProcedure
        .input(curatorSchemaUpdate)
        .mutation(async ({ input: curator }) => {

            const data1 = curator;

            return db.curator.update({
                where: {
                    id: curator.id,
                },
                data: {
                    ...data1,
                    group_links: {
                        deleteMany: {},
                        create: data1.group_links.map((el: any) => {
                            const {curatorId, ...data} = el;
                            return data;
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
                }
            })
        })
});
