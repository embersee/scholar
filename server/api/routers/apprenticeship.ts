import {createTRPCRouter, protectedProcedure, publicProcedure} from "../trpc";

import { db } from "@/server/db";
import {apprenticeshipSchema} from "@/server/schema/apprenticeship";
import {z} from "zod";

export const apprenticeshipRouter = createTRPCRouter({
    getApprenticeships: publicProcedure.query(async () => {
        return db.apprenticeship.findMany();
    }),

    getApprenticeshipById: protectedProcedure
        .input(apprenticeshipSchema.pick({user_id: true}))
        .query(async ({ input: { user_id } }) => {
            return db.apprenticeship.findFirst({
                where: {
                    user_id,
                },
            });
        }),

    createApprenticeship: protectedProcedure
        .input(apprenticeshipSchema)
        .mutation(async ({ input: data }) => {
            return db.apprenticeship.create({
                data
            });
        }),

    updateApprenticeship: protectedProcedure
        .input(apprenticeshipSchema.extend({id: z.string()}))
        .mutation(async ({ input: data}) => {
            return db.apprenticeship.update({
                data,
                where: {
                    id: data.id,
                },
            });
        }),

    deleteApprenticeship: protectedProcedure
        .input(apprenticeshipSchema.extend({id: z.string()}).pick({id: true}))
        .mutation(async ({ input: {id} }) => {
            return db.apprenticeship.delete({
                where: {
                    id,
                },
            });
        }),
});
