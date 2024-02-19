import {
    Drawer, DrawerClose,
    DrawerContent,
    DrawerDescription, DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/components/ui/drawer";
import {Button} from "@/components/ui/button";
import InstitutionCreateForm from "@/components/dash/InstitutionCreateForm";
import {useState} from "react";

export default function AddInstutionForm({refetch}: {refetch: () => void}) {
    const [open, setOpen] = useState<boolean>(false);
    const handleCreate = () => {
        refetch()
        setOpen(false);
    }
    return (

        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button>Add</Button>
            </DrawerTrigger>
            <DrawerContent className="flex flex-col items-center">
                <DrawerHeader>
                    <DrawerTitle>New Institution</DrawerTitle>
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
                            Cancel
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
