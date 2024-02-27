// import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, } from "react";
import autoAnimate from "@formkit/auto-animate";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Curator, CuratorForm, curatorSchemaForm } from "@/server/schema/curator";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "../ui/use-toast";
import { useZodForm } from "@/lib/utils";

const CuratorEditForm = ({ onCreate, data }: { onCreate: Function, data: Curator }) => {
    const parent = useRef(null);

    useEffect(() => {
        parent.current && autoAnimate(parent.current);
    }, [parent]);

    const form = useZodForm({
        schema: curatorSchemaForm,
        defaultValues: data,
        mode: "onChange",
    });


    const { fields, append, remove } = useFieldArray({
        name: "group_links",
        control: form.control,
    });

    const { mutate: curatorMutation, isLoading: isCreating } =
        api.curators.updateCurator.useMutation({
            onMutate: () => {
                toast({
                    title: '🔄 Updating...',
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
                    description: 'Curator updated'
                })
                onCreate()
            },
        });

    const handleSubmit = (values: CuratorForm) => {
        curatorMutation(values);
    };


    return <Form {...form}>
        <form autoComplete="off" className="flex flex-col w-[700px] max-w-full gap-2"
            onSubmit={form.handleSubmit(handleSubmit)} ref={parent}>
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
                                name={`group_links.${index}.group_name`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name: </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="w-[250px]"
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
                                name={`group_links.${index}.group_link`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Link: </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="w-[250px]"
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
            <Button type="submit">{isCreating ? "Submitting..." : "Submit"}</Button>
        </form>
    </Form>
}

export default CuratorEditForm;
