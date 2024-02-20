"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import autoAnimate from "@formkit/auto-animate";
import { api } from "@/trpc/react";
import { ColumnDef } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { DataTable } from "@/components/dash/Table";
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



const UsersTable = () => {
    const parent = useRef(null);
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState<UserSchema>()
    const handleCreate = () => {
        usersList.refetch();
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

    const usersList = api.user.getUsers.useQuery();

    if (usersList.isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="w-full">
            {usersList.data && usersList.data.length > 0 ? (
                <div className="w-full  rounded-lg bg-white shadow-lg">
                    <DataTable columns={columns} data={usersList.data} />
                    <Drawer
                        open={open}
                    >
                        <DrawerContent className="flex flex-col items-center">
                            <DrawerHeader>
                                <DrawerTitle>
                                    Edit Institution
                                </DrawerTitle>
                            </DrawerHeader>
                            {user && <UserEditForm onCreate={handleCreate} data={user} />}
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
                    Still No Users Yet
                </div>
            )}
        </div>
    );
};

export default UsersTable;




