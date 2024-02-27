"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import autoAnimate from "@formkit/auto-animate";
import { api } from "@/trpc/react";
import { ColumnDef } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { DataTable } from "@/components/dash/dataTable/Table";

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";


import { GetApprenticeship } from "@/server/schema/apprenticeship";
import { useRouter } from "next/navigation";
import ApprtsWithUsersEditForm from "./ApprtsWithUsersEditForm";
import { toast } from "../ui/use-toast";

const ApprtsTable = () => {
    const apprts = api.apprts.getApprenticeshipsWithUsers.useQuery();
    const parent = useRef(null);
    const [open, setOpen] = useState(false);
    const [apprtWithUser, setApprtWithUser] = useState();
    type apprt = GetApprenticeship[0];

    const curators = api.curators.getCurators.useQuery();
    const apprenticeshipTypes = api.apprts.getTypes.useQuery();
    useEffect(() => {
        parent.current && autoAnimate(parent.current);
    }, [parent]);
    const handleCreate = () => {
        apprts.refetch();
        setOpen(false);
    };

    const router = useRouter()
    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'id',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        id
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },
        {
            accessorKey: 'user.username',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="sticky"
                        style={{ left: 0, }} // указать ширину ячейки в процентах
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        username
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                return (
                    <div
                        className="text-right font-medium cursor-pointer sticky"
                        style={{ left: 0, }} // указать ширину ячейки в процентах
                        onClick={() => router.push(`https://t.me/${row.original?.user?.username}`)}
                    >
                        {row.original?.user?.display_name}
                    </div>
                )
            },
        },
        {

            accessorKey: 'start_date',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        start date
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },
        {
            accessorKey: 'end_date',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        end date
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },
        {
            accessorKey: 'referral',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        referral
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },
        {
            accessorKey: 'report',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        report
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },
        {
            accessorKey: 'curator.FIO',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        curator
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },
        {
            accessorKey: 'curatorGroup.group_name',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        {"curator's group"}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },
        {

            accessorKey: 'academic_year',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        academic year
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },
        {
            accessorKey: 'apprenticeship_type.name',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        apprenticeship type
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },
        {
            accessorKey: 'employment_status',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        employment_status
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },
        {
            accessorKey: 'attendance',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        attendance
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },


        },
        {
            accessorKey: 'signed',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        signed
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },
        {
            accessorKey: 'report_signed',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        report signed
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },

        {
            accessorKey: 'referral_signed',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        referral signed
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const data = row.original;
                const { mutate } = api.apprts.attendance.useMutation({
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
                        apprts.refetch()
                    },
                })

                return (
                    <Button variant="secondary" onClick={() => mutate({ id: data.id, user_id: data.user_id, attendance: data.attendance })}>Attendance</Button>
                )
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const data = row.original;
                const { mutate } = api.apprts.signed.useMutation({
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
                        apprts.refetch()
                    },
                })

                return (
                    <Button variant="secondary" onClick={() => mutate({ id: data.id, user_id: data.user_id, signed: data.signed })}>signed</Button>
                )
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const data = row.original;
                const { mutate } = api.apprts.reportSigned.useMutation({
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
                        apprts.refetch()
                    },
                })

                return (
                    <Button variant="secondary" onClick={() => mutate({ id: data.id, user_id: data.user_id, report_signed: data.report_signed })}>report signed</Button>
                )
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const data = row.original;
                const { mutate } = api.apprts.referralSigned.useMutation({
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
                        apprts.refetch()
                    },
                })

                return (
                    <Button variant="secondary" onClick={() => mutate({ id: data.id, user_id: data.user_id, referral_signed: data.referral_signed })}>referral signed</Button>
                )
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const user = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className='shadow-md'>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                                setOpen(true)
                                setApprtWithUser(user)
                            }}>
                                Edit
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ];
    return (
        <>
            {apprts.data && apprts.data.length > 0 ? (
                <div className="w-full rounded-lgshadow-lg">
                    <DataTable columns={columns} data={apprts.data} />
                    <Drawer
                        open={open}
                    >
                        <DrawerContent className="h-screen flex flex-col items-center">
                            <DrawerHeader>
                                <DrawerTitle>
                                    Edit Institution
                                </DrawerTitle>
                            </DrawerHeader>
                            {apprtWithUser && apprenticeshipTypes.data && curators.data && <ApprtsWithUsersEditForm apprenticeshipTypes={apprenticeshipTypes.data} curators={curators.data} onCreate={handleCreate} data={apprtWithUser} />}
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
                    Still No apprts Yet
                </div>
            )}
        </>
    );
};

export default ApprtsTable;




