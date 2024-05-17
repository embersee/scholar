"use client";

import { api } from "@/trpc/react";
import Link from "next/link";
import { ReportForm } from "./ReportAttachForm";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { Button } from "../ui/button";
import { useState } from "react";
import { Apprenticeship } from "@/server/schema/apprenticeship";
import { LoaderIcon } from "lucide-react";

export const StudentDashBoard = () => {
    const [open, setOpen] = useState(false);
    const apprt = api.apprts.getCurrentApprenticeship.useQuery();
    if (apprt.isLoading) return <LoaderIcon className="m-auto animate-spin" />
    if (!apprt.data) return (
        <div>
            <h3>У вас пока нет активных практик, вы можете начать <Link className="underline" href="/dash/apprts/new">новую</Link></h3>
        </div>
    );
    return (
        <div className="flex flex-col gap-2">
            {apprt.data.report && <div className="text-center">Отчет отправлен</div>}
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild><Button>{apprt.data.report? "Replace file": "Add a report"}</Button></DrawerTrigger>
                <DrawerContent className="flex flex-col items-center gap-2">
                    <DrawerHeader className="w-72 px-0">
                        <DrawerTitle>Repport Attachment Form</DrawerTitle>
                        <DrawerDescription className="text-center">Add a file of report and click 'Submit' to attach file</DrawerDescription>
                    </DrawerHeader>
                    <ReportForm data={apprt.data as Apprenticeship} onCreate={() => { setOpen(false); apprt.refetch(); }} />
                    <DrawerClose asChild><Button className="w-72" variant="outline">Close</Button></DrawerClose>
                </DrawerContent>
            </Drawer>
        </div>
    );
}