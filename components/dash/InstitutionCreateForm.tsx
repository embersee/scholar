import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useEffect, useId, useRef } from "react";
import autoAnimate from "@formkit/auto-animate";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { institutionSchema, Institution, InstitutionForm, institutionSchemaForm } from "@/server/schema/institution";
import { toast } from "../ui/use-toast";


const InstitutionCreateForm = ({ onCreate }: { onCreate: Function }) => {
    const parent = useRef(null);

    useEffect(() => {
        parent.current && autoAnimate(parent.current);
    }, [parent]);

    const form = useForm<InstitutionForm>({
        resolver: zodResolver(institutionSchemaForm),
        defaultValues: {
            name: "",
        },
        reValidateMode: "onChange"
    });

    const institutionMutation = api.institutions.createInstitution.useMutation({
        onMutate: () => {
            toast({
                title: '🔄 Создание...',
            })
        },
        onError: (e) => {
            toast({
                title: '🚫 Ошибка',
                description: e.message
            })
        },
        onSuccess: () => {
            toast({
                title: '✅ Успех',
                description: 'Учебное заведение успешно создано'
            })
            onCreate()
        },
    })


    function handleSubmit(data: InstitutionForm): void {

        institutionMutation.mutate(data);
    }

    return <Form {...form}>
        <form autoComplete="off" className="flex flex-col w-72 gap-2" onSubmit={form.handleSubmit(handleSubmit)} ref={parent}>
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Название</FormLabel>
                        <Input autoFocus autoComplete="off" aria-autocomplete="none" placeholder="Учебное заявление" {...field} />
                    </FormItem>
                )} />
            <Button type="submit">{institutionMutation.isLoading ? "Отправка..." : "Отправить"}</Button>
        </form>
    </Form>
}

export default InstitutionCreateForm;
