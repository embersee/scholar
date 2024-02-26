import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { ApprenticeshipTypes, apprenticeshipTypes } from "@/server/schema/apprenticeship";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useEffect, useId, useRef } from "react";
import autoAnimate from "@formkit/auto-animate";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { toast } from "../ui/use-toast";


const ApprtTypeCreateForm = ({ onCreate }: { onCreate: Function }) => {
    const parent = useRef(null);

    useEffect(() => {
        parent.current && autoAnimate(parent.current);
    }, [parent]);

    const form = useForm<ApprenticeshipTypes>({
        resolver: zodResolver(apprenticeshipTypes),
        defaultValues: {
            name: "",
            id: useId(),
        },
        reValidateMode: "onChange"
    });

    const apprtTypeMutation = api.apprts.createApprtType.useMutation({
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
                description: 'Apprenticeship type created'
            })
            onCreate()
        },
    })


    function handleSubmit(data: ApprenticeshipTypes): void {
        console.log(JSON.stringify(data));
        apprtTypeMutation.mutate(data);
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
            <Button type="submit">{apprtTypeMutation.isLoading ? "Submitting..." : "Submit"}</Button>
        </form>
    </Form>
}

export default ApprtTypeCreateForm;