"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import autoAnimate from "@formkit/auto-animate";
import { api } from "@/trpc/react";
import { ColumnDef } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { DataTable } from "@/components/dash/dataTable/Table";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";

import { Institution } from "@/server/schema/institution";

import InstitutionEditForm from "@/components/dash/InstitutionEditForm";
import { toast } from "../ui/use-toast";



const InstitutionsTable = ({ institutions }: { institutions: Institution[] }) => {
    const parent = useRef(null);
    const trpcClient = api.useUtils();
    const [open, setOpen] = useState(false);
    const [institution, setInstitution] = useState<Institution>()

    useEffect(() => {
        parent.current && autoAnimate(parent.current);
    }, [parent]);
    const handleCreate = () => {
        trpcClient.institutions.getInstitutions.refetch();
        setOpen(false);
    }
    const institutionRemove = api.institutions.removeInstitution.useMutation({
        onMutate: () => {
            toast({
                title: '🔄 Удаление...',
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
                description: 'Учебное заведение успешно удалено'
            })
            trpcClient.institutions.getInstitutions.refetch();
        },
    });

    const removeInstitution = (institutionId: string) => {
        if (confirm("Вы уверены?"))
            institutionRemove.mutate({ id: institutionId });
    };

    const columns: ColumnDef<Institution>[] = [
        {
            header: 'ID',
            accessorKey: 'id',
        },
        {
            header: 'Название',
            accessorKey: 'name',
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const institution = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className={`shadow-md `}>
                            <DropdownMenuLabel>Действия</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                                setOpen(true)
                                setInstitution(institution)
                            }}>
                                Редактировать
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                                removeInstitution(institution.id)
                            }}>
                                Удалить
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ];
    return (
        <div className="w-full mt-2">
            {institutions && institutions.length > 0 ? (
                <div className="w-full">
                    <DataTable columns={columns} data={institutions} />

                    <Drawer
                        open={open}
                    >
                        <DrawerContent className="flex flex-col items-center">
                            <DrawerHeader>
                                <DrawerTitle>
                                    Редактировать учебное заведение
                                </DrawerTitle>
                            </DrawerHeader>
                            {institution && <InstitutionEditForm onCreate={handleCreate} data={institution} />}
                            <DrawerFooter>
                                <DrawerClose asChild>
                                    <Button className="w-72" variant="outline" onClick={() => setOpen(false)}>
                                        Отмена
                                    </Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                </div>
            ) : (
                <div className="text-center font-medium">
                    Учебных заведений пока нет
                </div>
            )}
        </div>
    );
};

export default InstitutionsTable;




