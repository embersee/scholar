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
import UserEditForm from "@/components/dash/UserEditForm";
import { User as UserSchema } from "@/server/schema/user";
import { User } from "@prisma/client";
import { RouterOutputs } from "@/trpc/shared";

function UsersTable({ usersList }: { usersList: RouterOutputs["user"]["getUsersWithInstitution"] }) {
    const { data } = api.user.getUsersWithInstitution.useQuery(undefined, {
        initialData: usersList,
        refetchOnMount: false
    });
    const trpcClient = api.useUtils();
    const parent = useRef(null);
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState<UserSchema>()
    const handleCreate = () => {
        trpcClient.user.getUsers.refetch();
        setOpen(false);
    };
    useEffect(() => {
        parent.current && autoAnimate(parent.current);
    }, [parent]);

    const columns: ColumnDef<User>[] = [
        {
            header: 'ID',
            accessorKey: 'id',
        },
        {
            header: 'Telegram ID',
            accessorKey: 'telegram_id',
        },
        {
            header: 'Username',
            accessorKey: 'username',
        },
        {
            header: 'Display Name',
            accessorKey: 'display_name',
        },
        {
            header: 'FIO',
            accessorKey: 'FIO',
        },
        {
            header: 'Phone Number',
            accessorKey: 'phone_number',
        },
        {
            header: 'Email',
            accessorKey: 'email',
        },
        {
            header: 'Role',
            accessorKey: 'role',
        },
        {
            header: 'Role',
            accessorKey: 'role',
        },
        {
            header: 'Specialty',
            accessorKey: 'specialty',
        },
        {
            header: 'institution',
            accessorKey: 'institution.name',
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
                                setUser(user as UserSchema)
                            }}>
                                Edit
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ];
    const institutions = api.institutions.getInstitutions.useQuery()

    return (
        <>
            {data ? (
                <>
                    <DataTable columns={columns} data={data} />
                    <Drawer
                        open={open}
                    >
                        <DrawerContent className="flex flex-col items-center">
                            <DrawerHeader>
                                <DrawerTitle>
                                    Edit Institution
                                </DrawerTitle>
                            </DrawerHeader>
                            {user && institutions.data && <UserEditForm onCreate={handleCreate} data={user} institutions={institutions.data} />}
                            <DrawerFooter>
                                <DrawerClose asChild>
                                    <Button className="w-72" variant="outline" onClick={() => setOpen(false)}>
                                        Cancel
                                    </Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                </>
            ) : (
                <div className="text-center font-medium">
                    Still No Users Yet
                </div>
            )}
        </>
    );
};

export default UsersTable;




