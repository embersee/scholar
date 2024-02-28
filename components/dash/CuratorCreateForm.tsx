import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { useEffect, useId, useRef } from "react";
import autoAnimate from "@formkit/auto-animate";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Curator, curatorSchemaForm, CuratorForm } from "@/server/schema/curator";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "../ui/use-toast";
import { useZodForm } from "@/lib/utils";
// const validationSchema = curatorSchema;
// function useZodForm<TSchema extends z.ZodType>(
//     props: Omit<UseFormProps<TSchema["_input"]>, "resolver"> & {
//         schema: TSchema;
//     },
// ) {
//     return useForm<TSchema["_input"]>({
//         ...props,
//         resolver: zodResolver(props.schema, undefined, {}),
//     });
// }
const CuratorCreateForm = ({ onCreate }: { onCreate: Function }) => {
    const parent = useRef(null);

    useEffect(() => {
        parent.current && autoAnimate(parent.current);
    }, [parent]);

    const form = useZodForm({
        schema: curatorSchemaForm,
        defaultValues: {
            telegram_id: "",
            FIO: "",
            group_links: [
                {
                    group_link: "",
                    group_name: "",
                }
            ],
        },
        mode: "onChange",
    });

    const { fields, append, remove } = useFieldArray({
        name: "group_links",
        control: form.control,
    });

    const curatorMutation = api.curators.createCurator.useMutation({
        onMutate: () => {
            toast({
                title: '🔄 Creating...',
            })
        },
        onError: (e) => {
            toast({
                title: '🚫 Error',
                description: e.message
            })
        },
        onSuccess: () => {
            toast({
                title: '✅ Success',
                description: 'Curator created'
            })
            onCreate()
        },
    })


    function handleSubmit(data: CuratorForm): void {
        curatorMutation.mutate(data);
    }


    return <Form {...form}>
        <form autoComplete="off" className="flex flex-col  w-[700px] max-w-full gap-2" onSubmit={form.handleSubmit(handleSubmit)}
            ref={parent}>
            <FormField
                control={form.control}
                name="telegram_id"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Telegram ID</FormLabel>
                        <Input autoFocus autoComplete="off" aria-autocomplete="none"
                            placeholder="Введите id" {...field} />
                    </FormItem>
                )} />
            <FormField
                control={form.control}
                name="FIO"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>FIO</FormLabel>
                        <Input autoFocus autoComplete="off" aria-autocomplete="none"
                            placeholder="Введите ФИО" {...field} />
                    </FormItem>
                )} />

            <FormItem>
                <FormLabel>Group links</FormLabel>
                {fields.map((field, index) => {
                    return (
                        <div key={field.id} className="flex justify-between items-end gap-4">
                            <FormField
                                control={form.control}
                                name={`group_links.${index}.group_name` as const}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name: </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="w-[250px] max-w-full"
                                                autoComplete="off"
                                                placeholder="e.g. start, catalog, help etc."
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`group_links.${index}.group_link` as const}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Link: </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="w-[250px] max-w-full"
                                                autoComplete="off"
                                                placeholder="e.g. start, catalog, help etc."
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                className=" "
                                onClick={() => remove(index)}
                            >
                                Delete
                            </Button>
                        </div>
                    );
                })}

                <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                        append({
                            group_link: "",
                            group_name: ""
                        })}
                >
                    Add new link
                </Button>
            </FormItem>

            <Button type="submit">{curatorMutation.isLoading ? "Submitting..." : "Submit"}</Button>
        </form>
    </Form>
}

export default CuratorCreateForm;
