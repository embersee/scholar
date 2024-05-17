import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import autoAnimate from "@formkit/auto-animate";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { toast } from "../ui/use-toast";
import { Apprenticeship, UpdateApprenticeshipForm, updateApprenticeshipFormSchema } from "@/server/schema/apprenticeship";

export const ReportForm = ({ onCreate, data }: { onCreate: Function, data: Apprenticeship }) => {
    const [reportFile, setReportFile] = useState<File | null>(null);

    const parent = useRef(null);
    useEffect(() => {
        parent.current && autoAnimate(parent.current);
    }, [parent]);
    const form = useForm<UpdateApprenticeshipForm>({ //any>({
        resolver: zodResolver(updateApprenticeshipFormSchema),
        defaultValues: {
            id: data.id,
            user_id: data.user_id,
            date: {
                from: data.start_date,
                to: data.end_date,
            },
            start_date: data.start_date,
            end_date: data.end_date,
            referral: data.referral? data.referral: '',
            apprenticeshipTypeId: data.apprenticeshipTypeId,
            report: data.report? data.report: '',
            //employment_status: data.employment_status,
            curatorId: data.curatorId? data.curatorId: '',
            curatorGroupId: data.curatorGroupId? data.curatorGroupId: '',
            academic_year: data.academic_year,
        },
        reValidateMode: "onChange"
    });
    const apprtsEditMutation = api.apprts.updateApprenticeship.useMutation({
        onMutate: () => {
            toast({
                title: '🔄 Обноволение...',
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
                description: 'Практика успешно обновлена'
            })
            onCreate()
        },
    })

    async function handleSubmit(data: UpdateApprenticeshipForm) {
        try {
            console.log(reportFile)
            if (!reportFile) throw new Error("Прикрепите файл направления");

            const reportFormData = new FormData();
            reportFormData.append("file[]", reportFile);
            reportFormData.append("system", "scholar");
            reportFormData.append("path", "");
            reportFormData.append("name", "report");
        
            const reportResponse = await fetch(`http://127.0.0.11:8000/api/upload`, {
              method: "POST",
              mode: "cors",
              body: reportFormData,
            })

            if (reportResponse.ok) {
                const reportResponseData = await reportResponse.json();
                console.log("accepted report:", reportResponseData);
                if (reportResponseData.length < 1) throw new Error("Failed to save file");

                if (!data.curatorId) {
                    data.curatorId = '';
                }

                data.start_date = data.date.from;
                data.end_date = data.date.to;
                console.log(data)
                apprtsEditMutation.mutate({ 
                    ...data, 
                    start_date: data.date.from, 
                    end_date: data.date.to, 
                    report: `http://127.0.0.1:8000/api/files/${reportResponseData[0].id}`, 
                });
            }
            else throw new Error("Failed to save file");
        }
        catch (e: any) {
            toast({
                title: '🚫 Ошибка',
                description: e?.message,
            })
        }


    }

    return <Form {...form}>
        <form autoComplete="off" className="z-10  overflow-auto flex flex-col w-100 gap-2" onSubmit={form.handleSubmit(handleSubmit)} ref={parent}>

            <FormField
                control={form.control}
                name="report"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Отчет</FormLabel>
                        <FormControl>
                                <Input
                                    accept=".jpg, .jpeg, .png, .svg, .gif, .mp4"
                                    type="file"
                                    onChange={e => e.target.files ? setReportFile(e.target.files[0]) : null}
                                    autoFocus autoComplete="off" aria-autocomplete="none" placeholder="Отчет"
                                ></Input>
                            </FormControl>

                    </FormItem>
                )} />

            <Button type="submit">{apprtsEditMutation.isLoading ? "Отправка..." : "Отправить"}</Button>
        </form>
    </Form>
}
