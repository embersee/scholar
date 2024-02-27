import { z } from "zod";

export const curatorSchema = z.object({
    id: z.string(),
    telegram_id: z.string(),
    FIO: z.string(),
    group_links: z.array(z.object(
        {
            id: z.string().optional(),
            group_name: z.string(),
            group_link: z.string(),
            curatorId: z.string().optional()
        }
    )),
});

export const insertCuratorSchema = curatorSchema
    .omit({
        id: true
    })

export const updateCuratorSchema = curatorSchema
    .omit({
        id: true
    }).extend({
        id: z.string().optional(),
    })


export const curatorSchemaForm  = z.object({
    id: z.string().optional(),
    telegram_id: z.string().min(1, "Обьязательное поле"),
    FIO: z.string().min(1, "Обьязательное поле"),
    group_links: z.array(z.object(
        {
            id: z.string().optional(),
            group_name: z.string().min(1, "Обьязательное поле"),
            group_link: z.string().min(1, "Обьязательное поле"),
            curatorId: z.string().optional()
        }
    )),
});

export type Curator = z.infer<typeof curatorSchema>;

export type CuratorForm = z.infer<typeof curatorSchemaForm>;
