import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useEffect, useRef } from "react";
import autoAnimate from "@formkit/auto-animate";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Combobox } from "../ui/combobox";
import { Curator } from "@/server/schema/curator";
import { toast } from "../ui/use-toast";
import { ApprenticeshipTypes, apprenticeshipFormSchema, apprenticeshipSchema, updateApprenticeshipFormSchema } from "@/server/schema/apprenticeship";
import { Checkbox } from "../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";



const ApprtsWithUsersEditForm = ({ onCreate, data, curators, apprenticeshipTypes }: { onCreate: Function, data: any, curators: Curator[], apprenticeshipTypes: ApprenticeshipTypes[] }) => {
    const parent = useRef(null);
    useEffect(() => {
        parent.current && autoAnimate(parent.current);
    }, [parent]);
    const form = useForm<any>({
        resolver: zodResolver(updateApprenticeshipFormSchema),
        defaultValues: {
            id: data.id,
            user_id: data.user_id,
            start_date: data.start_date,
            end_date: data.end_date,
            referral: data.referral,
            apprenticeshipTypeId: data.apprenticeshipTypeId,
            report: data.report,
            employment_status: data.employment_status,
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
        value: v.id as string,
        label: v.name,
    }));


    function handleSubmit(data: any): void {
        if (!data.curatorId) {
            data.curatorId = '';
        }
        console.log(data)
        apprtsEditMutation.mutate(data);
    }

    return <Form {...form}>
        <form autoComplete="off" className="z-10  overflow-auto flex flex-col w-100 gap-2" onSubmit={form.handleSubmit(handleSubmit)} ref={parent}>

            <div className="flex">
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem className="w-72">
                            <FormLabel>Диапазон дат практики</FormLabel>
                            <FormControl>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="date"
                                            variant={"outline"}
                                            className={cn(
                                                " justify-start text-left font-normal w-[100%]",
                                                !form.watch().date && "text-muted-foreground",
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {field.value ? (
                                                form.watch().date.to ? (
                                                    <>
                                                        {format(form.watch().date.from, "dd LLLL y", {
                                                            locale: ru,
                                                        })}
                                                        {` – `}
                                                        {format(form.watch().date.to, "dd LLLL y", {
                                                            locale: ru,
                                                        })}
                                                    </>
                                                ) : (
                                                    format(form.watch().date.from, "dd LLLL y", {
                                                        locale: ru,
                                                    })
                                                )
                                            ) : (
                                                <span>Выбери даты</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            initialFocus
                                            mode="range"
                                            defaultMonth={form.watch().date?.from}
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            numberOfMonths={2}
                                            locale={ru}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </FormControl>


                        </FormItem>
                    )}
                />
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
            <FormField
                control={form.control}
                name="employment_status"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>employment status</FormLabel>
                        <FormControl>
                            <Checkbox
                                className="ml-4"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                    </FormItem>
                )} />
            <Button type="submit">{apprtsEditMutation.isLoading ? "Submitting..." : "Submit"}</Button>
        </form>
    </Form>
}

export default ApprtsWithUsersEditForm;