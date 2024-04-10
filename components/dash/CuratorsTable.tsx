"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import autoAnimate from "@formkit/auto-animate";
import { api } from "@/trpc/react";
import { ColumnDef } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Copy, MoreHorizontal } from "lucide-react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { Curator } from "@/server/schema/curator";
import CuratorEditForm from "@/components/dash/CuratorEditForm";
import { DataTable } from "./dataTable/Table";
import { toast } from "../ui/use-toast";

const CuratorsTable = ({ curators }: { curators: Curator[] }) => {
    const parent = useRef(null);
    const [open, setOpen] = useState(false);
    const [curatorSelected, setCuratorSelected] = useState<Curator>()
    const trpcClient = api.useUtils();
    useEffect(() => {
        parent.current && autoAnimate(parent.current);
    }, [parent]);

    const handleCreate = () => {
        trpcClient.curators.getCurators.refetch();
        setOpen(false);
    }
    const curatorRemove = api.curators.removeCurator.useMutation({
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
            trpcClient.curators.getCurators.refetch();
            toast({
                title: '✅ Успех',
                description: 'Куратор успешно удален'
            })

        },
    });

    const deleteCurator = (id: string) => {
        if (confirm("Вы уверены?"))
            curatorRemove.mutate({ id });
    };

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text);
    }

    const columns: ColumnDef<Curator>[] = [
        {
            header: 'ФИО',
            accessorKey: 'FIO',
        },
        {
            header: 'telegram_id',
            accessorKey: 'telegram_id',
        },
        {
            header: 'Ссылки на группы',
            accessorKey: 'group_links',
            cell: ({ row }) => {
                const curator = row.original
                return (
                    <div className={"flex flex-col gap-[5px]"}>
                        {curator?.group_links?.map((link, i) => <div className={"flex gap-[7px] items-center"}
                            key={link.curatorId}>
                            <a href={link.group_link} target="_blank">{i + 1}. {link.group_name}</a>
                            <Copy size={16} className={"hover:opacity-50 hover:cursor-pointer"}
                                onClick={() => copyToClipboard(link.group_link)} />
                        </div>)}
                    </div>

                )
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const curator = row.original
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
                                setCuratorSelected(curator)
                            }}>
                                Редактировать
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                                deleteCurator(curator.id)
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
            {curators && curators.length > 0 ? (
                <div className="w-full">
                    <DataTable columns={columns} data={curators} />
                    <Drawer
                        open={open}
                    >
                        <DrawerContent className="flex flex-col items-center">
                            <DrawerHeader>
                                <DrawerTitle>
                                    Редактировать Куратора
                                </DrawerTitle>
                            </DrawerHeader>
                            {curatorSelected && <CuratorEditForm onCreate={handleCreate} data={curatorSelected} />}
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
                    Still No Curators Yet
                </div>
            )}
        </div>
    );
};

export default CuratorsTable;




