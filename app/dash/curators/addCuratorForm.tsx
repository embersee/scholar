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
import { useState } from "react";
import CuratorCreateForm from "@/components/dash/CuratorCreateForm";
import { api } from "@/trpc/react";

export default function AddCuratorForm() {
    const trpcClient = api.useUtils();
    const [open, setOpen] = useState<boolean>(false);
    const handleCreate = () => {
        trpcClient.curators.getCurators.refetch();
        setOpen(false);
    }
    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button>Add</Button>
            </DrawerTrigger>
            <DrawerContent className="flex flex-col items-center">
                <DrawerHeader>
                    <DrawerTitle>New Curator</DrawerTitle>
                    <DrawerDescription>
                        description
                    </DrawerDescription>
                </DrawerHeader>
                <CuratorCreateForm
                    onCreate={() => handleCreate()}
                />
                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button className="w-72" variant="outline">
                            Cancel
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
