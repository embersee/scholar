'use client'
import {
    Drawer, DrawerClose,
    DrawerContent,
    DrawerDescription, DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import InstitutionCreateForm from "@/components/dash/InstitutionCreateForm";
import { useState } from "react";
import { api } from "@/trpc/react";

export default function AddInstutionForm() {
    const trpcClient = api.useUtils();
    const [open, setOpen] = useState<boolean>(false);
    const handleCreate = () => {
        trpcClient.institutions.getInstitutions.refetch();
        setOpen(false);
    }
    return (

        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button>Добавить</Button>
            </DrawerTrigger>
            <DrawerContent className="flex flex-col items-center">
                <DrawerHeader>
                    <DrawerTitle>Новое учебное заведение</DrawerTitle>
                    <DrawerDescription>
                        description
                    </DrawerDescription>
                </DrawerHeader>
                <InstitutionCreateForm
                    onCreate={() => handleCreate()}
                />
                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button className="w-72" variant="outline">
                            Отмена
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
