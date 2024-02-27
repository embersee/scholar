import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useEffect, useRef } from "react";
import autoAnimate from "@formkit/auto-animate";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";


import { Checkbox } from "../ui/checkbox";
import { Combobox } from "../ui/combobox";
import { Curator } from "@/server/schema/curator";
import { toast } from "../ui/use-toast";




const ApprtsWithUsersEditForm = ({ onCreate, data, curators }: { onCreate: Function, data: any, curators: Curator[] }) => {
    const parent = useRef(null);
    useEffect(() => {
        parent.current && autoAnimate(parent.current);
    }, [parent]);

    const form = useForm<any>({

        defaultValues: {
            id: data.id,
            username: data.user.username,
            start_date: data.start_date,
            end_date: data.end_date,
            referral: data.referral,
            report: data.report,
            curatorId: data.curator,
            curatorGroupId: data.curator ? data.curator.group_links.id : '',
            academic_year: data.academic_year,
            attendance: data.attendance,
            signed: data.signed,
            report_signed: data.report_signed,
            referral_signed: data.referral_signed,

        },
        reValidateMode: "onChange"
    });
    const apprtsEditMutation = api.apprts.updateApprenticeship.useMutation({
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
                description: 'Apprenticeship updated'
            })
            onCreate()
        },
    })
    const catalogCurators = curators.map((v) => ({
        value: v.id,
        label: v.FIO,
    }));


    function handleSubmit(data: any): void {
        console.log(JSON.stringify(data));
        console.log(data)
        apprtsEditMutation.mutate(data);
    }

    return <Form {...form}>
        <form autoComplete="off" className="z-10  overflow-auto flex flex-col w-100 gap-2" onSubmit={form.handleSubmit(handleSubmit)} ref={parent}>
            <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Id</FormLabel>
                        <Input autoFocus autoComplete="off" aria-autocomplete="none" placeholder="00001" {...field} />
                    </FormItem>
                )} />
            <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Username</FormLabel>
                        <Input autoComplete="off" aria-autocomplete="none" placeholder="Username" {...field} />
                    </FormItem>
                )} />
            <div className="flex">
                <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>start date</FormLabel>
                            <Input autoFocus autoComplete="off" aria-autocomplete="none" placeholder="start_date" {...field} />
                        </FormItem>
                    )} />
                <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>end_date</FormLabel>
                            <Input autoFocus autoComplete="off" aria-autocomplete="none" placeholder="end_date" {...field} />
                        </FormItem>
                    )} />
            </div>
            <FormField
                control={form.control}
                name="referral"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>referral</FormLabel>
                        <Input autoFocus autoComplete="off" aria-autocomplete="none" placeholder="referral" {...field} />
                    </FormItem>
                )} />
            <FormField
                control={form.control}
                name="report"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>report</FormLabel>
                        <Input autoFocus autoComplete="off" aria-autocomplete="none" placeholder="report" {...field} />
                    </FormItem>
                )} />
            <FormField
                control={form.control}
                name="curatorId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>curator</FormLabel>
                        <FormControl>
                            <Combobox
                                options={catalogCurators}
                                {...field}
                                names={{
                                    button: "Выбрать вид",
                                    empty: "Нету такого...",
                                    search: "Поиск вида практики",
                                }}
                            />
                        </FormControl>
                    </FormItem>
                )} />
            <FormField
                control={form.control}
                name="curatorGroupId"
                render={({ field }) => (
                    <FormItem>

                        <FormLabel>group</FormLabel>
                        <Combobox
                            options={curators.find(curator => curator.id === form.getValues('curatorId'))?.group_links.map((v) => ({
                                value: v.id,
                                label: v.group_name
                            })) || []}
                            {...field}
                            names={{
                                button: "Выбрать вид",
                                empty: "Нету такого...",
                                search: "Поиск вида практики",
                            }}
                        />

                    </FormItem>
                )} />
            <FormField
                control={form.control}
                name="academic_year"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>academic_year</FormLabel>
                        <Input autoFocus autoComplete="off" aria-autocomplete="none" placeholder="academic_year" {...field} />
                    </FormItem>
                )} />
            <FormField
                control={form.control}
                name="attendance"
                render={({ field }) => (
                    <FormItem className="flex  items-center">
                        <FormLabel>
                            <Checkbox
                                className="mr-4"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                            attendance
                        </FormLabel>
                    </FormItem>
                )} />
            <FormField
                control={form.control}
                name="signed"
                render={({ field }) => (
                    <FormItem className="flex items-center">
                        <FormLabel>
                            <Checkbox
                                className="mr-4"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                            signed
                        </FormLabel>
                    </FormItem>
                )} />
            <FormField
                control={form.control}
                name="report_signed"
                render={({ field }) => (
                    <FormItem className="flex items-center">
                        <FormLabel>
                            <Checkbox
                                className="mr-4"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                            report_signed
                        </FormLabel>
                    </FormItem>
                )} />
            <FormField
                control={form.control}
                name="referral_signed"
                render={({ field }) => (
                    <FormItem className="flex items-center">
                        <FormLabel>
                            <Checkbox
                                className="mr-4"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                            referral_signed
                        </FormLabel>
                    </FormItem>
                )} />
            <Button type="submit">{apprtsEditMutation.isLoading ? "Submitting..." : "Submit"}</Button>
        </form>
    </Form>
}

export default ApprtsWithUsersEditForm;