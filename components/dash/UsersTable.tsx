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

import { Role, User } from "@prisma/client";
import {UserMakeAdminButton} from "@/components/dash/UserMakeAdminButton";
import { toast } from "../ui/use-toast";
import { DataTableRightsSelector } from "./dataTable/DataTableRightsSelector";
import { RotateCw } from "lucide-react";
import { RouterOutputs } from "@/trpc/shared";


function displayTimeFromDate(date: Date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`
}


function UsersTable({ usersList }: { usersList: RouterOutputs["user"]["getUsersWithInstitution"] }) {
    const { data } = api.user.getUsersWithInstitution.useQuery(undefined, {
        initialData: usersList,
        refetchOnMount: false
    });
    const trpcClient = api.useUtils();

    const parent = useRef(null);
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState<UserSchema>()
    const [lastQueryDate, setLastQueryDate] = useState<Date | null>(null);

    const handleCreate = () => {
        handleRefetch();
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
            header: 'Имя пользователя',
            accessorKey: 'username',
        },
        {
            header: 'Отображаемое имя',
            accessorKey: 'display_name',
        },
        {
            header: 'ФИО',
            accessorKey: 'FIO',
        },
        {
            header: 'Номер телефона',
            accessorKey: 'phone_number',
        },
        {
            header: 'Email',
            accessorKey: 'email',
        },
        {
            header: 'Роль',
            accessorKey: 'role',
        },
        {
            header: 'Специальность',
            accessorKey: 'specialty',
        },
        {
            header: 'Учебное заведение',
            accessorKey: 'institution.name',
        },
        {
            id: "actions",
            cell: ({ row,}) => {
                const user = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className='shadow-md'>
                            <DropdownMenuLabel>Действия</DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem onClick={() => {
                                setOpen(true)
                                setUser(user as UserSchema)
                            }}>
                                Редактировать
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={e => e.preventDefault()}>
                                <UserMakeAdminButton onClickAction={() => handleMakeAdmin(user, Role.ADMINISTRATION)}>
                                    Сделать администратором
                                </UserMakeAdminButton>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={e => e.preventDefault()}>
                                <UserMakeAdminButton onClickAction={() => handleMakeAdmin(user, Role.ADMIN)}>
                                    Сделать админом
                                </UserMakeAdminButton>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    // const trpcClient = api.useUtils();

    // const usersList = users;

    useEffect(() => {
        setLastQueryDate(new Date());
    }, []);

    const handleRefetch = () => {
        trpcClient.user.getUsersWithInstitution.refetch().then(() => setLastQueryDate(new Date()));
    }

    const institutions = api.institutions.getInstitutions.useQuery()

    const userEditMutation = api.user.updateUser.useMutation({
        onMutate: () => {
            toast({
                title: '🔄 Обновление...',
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
                description: 'Пользователь успешно обновлен'
            })
            handleRefetch();
        },
    })


    function handleMakeAdmin(data: User, newRole: Role): void {
        if (!data.institutionId) return;
        userEditMutation.mutate({id: data.id, telegram_id: data.telegram_id, role: newRole, institutionId: data.institutionId});
    }

    const [rolesDisplayed, setRolesDisplayed] = useState<Role[]>(Object.keys(Role) as Role[]);

    const handleOnlyAdmins = (roles: Role[]) => {
        console.log(roles);
        setRolesDisplayed(roles);
    };


    return (
        <>
            {data ? (
                <>
                    {/*<DataTable columns={columns} data={data} />*/}

                   <DataTable additionalFilters={
                        <div className="basis-full  flex items-center gap-2 justify-beetween">
                        <div className="flex gap-2 items-center">
                            <span>
                                Обновлено в {lastQueryDate && displayTimeFromDate(lastQueryDate)}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                className="hidden flex "
                                onClick={handleRefetch}
                            >
                                <RotateCw className="mr-2 h-4 w-4"/>
                                Обновить
                            </Button>
                        </div>
                        <DataTableRightsSelector onChange={handleOnlyAdmins} />
                    </div>
                    } columns={columns} data={data.filter(user => rolesDisplayed.includes(user.role))} />

                    <Drawer
                        open={open}
                    >
                        <DrawerContent className="flex flex-col items-center">
                            <DrawerHeader>
                                <DrawerTitle>
                                    Редактировать студента
                                </DrawerTitle>
                            </DrawerHeader>
                            {user && institutions.data && <UserEditForm onCreate={handleCreate} data={user} institutions={institutions.data} />}
                            <DrawerFooter>
                                <DrawerClose asChild>
                                    <Button className="w-72" variant="outline" onClick={() => setOpen(false)}>
                                        Отмена
                                    </Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                </>
            ) : (
                <div className="text-center font-medium">
                    Пока нет пользователей
                </div>
            )}
        </>
    );
};

export default UsersTable;




