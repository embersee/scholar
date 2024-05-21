"use client";

import { api } from "@/trpc/react";
import Link from "next/link";
import { ReportForm } from "./ReportAttachForm";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Apprenticeship } from "@/server/schema/apprenticeship";
import { FileIcon, IceCreamIcon, LoaderIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { toast } from "../ui/use-toast";

type FileInfo = {
    id: string,
    path: string,
    name: string,
    system: string,
    created_at: Date,
    updated_at: Date,
    data_hash: string,
    type: string,
}

export const StudentDashBoard = () => {
    const [open, setOpen] = useState(false);
    const [fileInfo, setFileInfo] = useState<null | FileInfo>(null);

    const apprt = api.apprts.getCurrentApprenticeship.useQuery();

    useEffect(() => {
        if (!apprt.isLoading && apprt.data?.report) {
            const fileId = apprt.data.report.replace("http://127.0.0.1:8000/api/files/", "");
            console.log("file_id", fileId);
            fetch(
                `http://127.0.0.1:8000/api/files/info/${fileId}`, {
                method: "GET",
                mode: "cors"
            }).then(data => data.json()).then((fileData: FileInfo) => setFileInfo(fileData)).catch(e => console.log(e.message));
        }
    }, [apprt.isFetching]);

    if (apprt.isLoading) return <LoaderIcon className="m-auto animate-spin" />
    if (!apprt.data) return (
        <div>
            <h3>У вас пока нет активных практик, вы можете начать <Link className="underline" href="/dash/apprts/new">новую</Link></h3>
        </div>
    );
    
    return <Alert className="flex justify-between">
        {apprt.data.report ? <FileIcon className="h-4 w-4" /> : <IceCreamIcon className="h-6 w-6" color="green" />}
        <div className="flex flex-col">
            <AlertTitle>{apprt.data.report ? (fileInfo?.name || "File") : "Вам одобрили прохождение практики"}</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
                {apprt.data.report ? "Отчет отправлен" : "После окончания прикрепите отчет здесь"}
            </AlertDescription>
        </div>
        {apprt.data.report ? <RemoveReportFileButton apprt={apprt.data as Apprenticeship} onCreate={() => { setOpen(false); apprt.refetch(); }} /> : (
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild><Button>{apprt.data.report ? "Replace file" : "Add a report"}</Button></DrawerTrigger>
                <DrawerContent className="flex flex-col items-center gap-2">
                    <DrawerHeader className="w-72 px-0">
                        <DrawerTitle>Repport Attachment Form</DrawerTitle>
                        <DrawerDescription className="text-center">Add a file of report and click 'Submit' to attach file</DrawerDescription>
                    </DrawerHeader>
                    <ReportForm data={apprt.data as Apprenticeship} onCreate={() => { setOpen(false); apprt.refetch(); }} />
                    <DrawerClose asChild><Button className="w-72" variant="outline">Close</Button></DrawerClose>
                </DrawerContent>
            </Drawer>)}
    </Alert>
}

const RemoveReportFileButton = ({ apprt, onCreate }: { apprt: Apprenticeship, onCreate: Function }) => {
    if (!apprt) return <></>;
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
    });

    const handleClick = async () => {
        if (confirm("Are you shure?")) {
            try {
                if (!apprt.report) throw new Error("report file link is incorrect");

                const fileId = apprt.report.replace("http://127.0.0.1:8000/api/files/", "");
                const deletionFormData = new FormData();
                deletionFormData.append("ids[]", fileId);
                const res = await fetch("http://127.0.0.1:8000/api/files/batch-destroy/", {
                    method: "POST",
                    mode: "cors",
                    body: deletionFormData
                });
                if (!res.ok) throw new Error("Failed to delete file");

                if (!apprt.curatorId) {
                    apprt.curatorId = '';
                }
                if (!apprt.curatorGroupId) {
                    apprt.curatorGroupId = '';
                }

                apprtsEditMutation.mutate({
                    ...apprt,
                    date: {
                        from: apprt.start_date,
                        to: apprt.end_date
                    },
                    report: "",
                });
            }
            catch (e: any) {
                toast({
                    title: '🚫 Ошибка',
                    description: e?.message,
                });
            }
        }
    }

    return <Button variant="outline" onClick={handleClick}>Remove</Button>;
}