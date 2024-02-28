import { z } from "zod";

export const institutionSchema = z.object({
  id: z.string(),
  name: z.string().min(1,"Обязательное поле"),
});
export const institutionSchemaForm = z.object({
  name: z.string().min(1,"Обязательное поле"),
});


export const updateInstitutionSchema = institutionSchema
  .omit({
    id: true
  })


export const InputInstitutionSchema = institutionSchema
  .omit({
    id: true
  })
  .extend({
    id: z.string()
  })
export type Institution = z.infer<typeof institutionSchema>;
export type InstitutionForm =  z.infer<typeof institutionSchemaForm>;
