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

import CuratorCreateForm from "@/components/dash/CuratorCreateForm";
import CuratorEditForm from "@/components/dash/CuratorEditForm";
import { DataTable } from "./dataTable/Table";
import { toast } from "../ui/use-toast";



const CuratorsTable = ({ refetch, curators }: { refetch: () => void, curators: Curator[] }) => {
    const parent = useRef(null);
    const [open, setOpen] = useState(false);
    const [curatorSelected, setCuratorSelected] = useState<Curator>()

    useEffect(() => {
        parent.current && autoAnimate(parent.current);
    }, [parent]);

    const handleCreate = () => {
        refetch();
        setOpen(false);
    }
    const curatorRemove = api.curators.removeCurator.useMutation({
        onMutate: () => {
            toast({
                title: '🔄 Removing...',
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
                description: 'Curator removed'
            })
            refetch()
        },
    });

    const deleteCurator = (id: string) => {
        if (confirm("Are you sure?"))
            curatorRemove.mutate({ id });
    };


    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text);
    }

    const columns: ColumnDef<Curator>[] = [
        {
            header: 'name',
            accessorKey: 'FIO',
        },
        {
            header: 'telegram_id',
            accessorKey: 'telegram_id',
        },
        {
            header: 'group_links',
            accessorKey: 'group_links',
            cell: ({ row }) => {
                const curator = row.original
                return (
                    <div className={"flex flex-col gap-[5px]"}>
                        {curator?.group_links?.map((link, i) => <div className={"flex gap-[7px] items-center"}
                            key={link.id}>
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
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                                setOpen(true)
                                setCuratorSelected(curator)
                            }}>
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                                deleteCurator(curator.id)
                            }}>
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ];
    return (
        <div className="w-full mt-2">
            {JSON.stringify(curators)}
            {curators && curators.length > 0 ? (
                <div className="w-full  rounded-lg bg-white shadow-lg">
                    <DataTable columns={columns} data={curators} />

                    <Drawer
                        open={open}
                    >
                        <DrawerContent className="flex flex-col items-center">
                            <DrawerHeader>
                                <DrawerTitle>
                                    Edit Curator
                                </DrawerTitle>
                            </DrawerHeader>
                            {curatorSelected && <CuratorEditForm onCreate={handleCreate} data={curatorSelected} />}
                            <DrawerFooter>
                                <DrawerClose asChild>
                                    <Button className="w-72" variant="outline" onClick={() => setOpen(false)}>
                                        Cancel
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




