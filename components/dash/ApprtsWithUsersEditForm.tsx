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
import { ApprenticeshipTypes } from "@/server/schema/apprenticeship";




const ApprtsWithUsersEditForm = ({ onCreate, data, curators, apprenticeshipTypes }: { onCreate: Function, data: any, curators: Curator[], apprenticeshipTypes: ApprenticeshipTypes[] }) => {
    const parent = useRef(null);
    useEffect(() => {
        parent.current && autoAnimate(parent.current);
    }, [parent]);
    const form = useForm<any>({
        defaultValues: {
            id: data.id,
            user_id: data.user_id,
            start_date: data.start_date,
            end_date: data.end_date,
            referral: data.referral,
            apprenticeshipTypeId: data.apprenticeshipTypeId,
            report: data.report,
            curatorId: data.curator ? data.curatorId : '',
            curatorGroupId: data.curator ? data.сuratorGroupId : '',
            academic_year: data.academic_year,
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
    const apprtsTypes = apprenticeshipTypes.map((v) => ({
        value: v.id,
        label: v.name,
    }));


    function handleSubmit(data: any): void {
        console.log(JSON.stringify(data));
        if (!data.curatorId) {
            data.curatorId = '';
        }
        apprtsEditMutation.mutate(data);
    }

    return <Form {...form}>
        <form autoComplete="off" className="z-10  overflow-auto flex flex-col w-100 gap-2" onSubmit={form.handleSubmit(handleSubmit)} ref={parent}>

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
                name="apprenticeshipTypeId"
                render={({ field }) => (
                    <FormItem className="w-72">
                        <FormLabel>Вид практики</FormLabel>
                        <FormControl>
                            <Combobox
                                options={apprtsTypes}
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
                                value: v.id as string,
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
            <Button type="submit">{apprtsEditMutation.isLoading ? "Submitting..." : "Submit"}</Button>
        </form>
    </Form>
}

export default ApprtsWithUsersEditForm;