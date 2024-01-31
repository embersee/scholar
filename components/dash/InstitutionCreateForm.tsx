import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useEffect, useId, useRef } from "react";
import autoAnimate from "@formkit/auto-animate";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { institutionSchema, Institution } from "@/server/schema/institution";


const InstitutionCreateForm = ({onCreate}:{onCreate: Function}) => {
    const parent = useRef(null);

    useEffect(() => {
        parent.current && autoAnimate(parent.current);
    }, [parent]);

    const form = useForm<Institution>({
        resolver: zodResolver(institutionSchema),
        defaultValues: {
            name: "",
            id: useId(),
        },
        reValidateMode: "onChange"
    });

    const institutionMutation = api.institutions.createInstitution.useMutation({ onSuccess: () => onCreate(), onError: console.error })


    function handleSubmit(data: Institution): void {
        console.log(JSON.stringify(data));
        institutionMutation.mutate(data);
    }

    return <Form {...form}>
        <form autoComplete="off" className="flex flex-col w-72 gap-2" onSubmit={form.handleSubmit(handleSubmit)} ref={parent}>
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <Input autoFocus autoComplete="off" aria-autocomplete="none" placeholder="Производственная практика" {...field} />
                    </FormItem>
                )} />
            <Button type="submit">{institutionMutation.isLoading ? "Submitting..." : "Submit"}</Button>
        </form>
    </Form>
}

export default InstitutionCreateForm;