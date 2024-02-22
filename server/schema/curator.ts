import { z } from "zod";

export const curatorSchema = z.object({
    id: z.string(),
    telegram_id: z.string(),
    FIO: z.string(),
    group_links: z.array(z.object(
        {
            id: z.string(),
            group_name: z.string(),
            group_link: z.string(),
            // curatorId: z.string().optional()
        }
    )),
});

export const curatorSchemaUpdate = z.object({
    id: z.string(),
    telegram_id: z.string(),
    FIO: z.string(),
    group_links: z.array(z.object(
        {
            id: z.string(),
            group_name: z.string(),
            group_link: z.string(),
            curatorId: z.string().optional()
        }
    )),
});

export const curatorSchemaForm  = z.object({
    id: z.string(),
    telegram_id: z.string(),
    FIO: z.string(),
});

export type Curator = z.infer<typeof curatorSchema>;

export type CuratorForm = z.infer<typeof curatorSchemaForm>;
