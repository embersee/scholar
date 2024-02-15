"use client";


import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import autoAnimate from "@formkit/auto-animate";
import { api } from "@/trpc/react";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"


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
        header: 'Institution',
        accessorKey: 'institution',
    },
    {
        header: 'Specialty',
        accessorKey: 'specialty',
    },
    {
        header: 'Actions',
        accessorKey: 'actions',
        cell: ({ row }) => (
            // <DataTableCell className="flex justify-center">
            //     <button
            //         onClick={() => {
            //             router.push(`/users/${row.original.id}/edit`);
            //         }}
            //         className="rounded-md bg-blue-500 py-1.5 px-3 font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            //     >
            //         Edit
            //     </button>
            // </DataTableCell>
            <>
            </>
        ),
    },
];
const UsersTable = () => {
    const parent = useRef(null);

    const [open, setOpen] = useState(false);

    useEffect(() => {
        parent.current && autoAnimate(parent.current);
    }, [parent]);

    const usersList = api.user.getUsers.useQuery();

    const router = useRouter();
    // const apprtTypeRemove = api.apprts.removeApprtType.useMutation({
    //     onError: console.error,
    //     onSuccess: () => apprtTypesList.refetch(),
    // });

    // const removeApprtType = (apprtTypeId: string) => {
    //     if (confirm("Are you shure?")) apprtTypeRemove.mutate({ id: apprtTypeId });
    // };
    if (usersList.isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="w-full">
            {usersList.data && usersList.data.length > 0 ? (
                <div className="w-full  rounded-lg bg-white shadow-lg">
                    <DataTable columns={columns} data={usersList.data} />
                </div>
            ) : (
                <div className="text-center font-medium">
                    Still No Apprenticeship Types Yet
                </div>
            )}
        </div>
    );
};

export default UsersTable;

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}


export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = useState({})
    const [columnVisibility, setColumnVisibility] =
        useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [sorting, setSorting] = useState<SortingState>([])

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    return (
        <div className="space-y-4">
            {/* <DataTableToolbar table={table} /> */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} colSpan={header.colSpan}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {/* <DataTablePagination table={table} /> */}
        </div>
    )
}

// interface DataTableProps<TData, TValue> {
//     columns: ColumnDef<TData, TValue>[]
//      TData[]
//   }

// function DataTableToolbar<TData, TValue>({
//     table,
// }: {
//     table: any
// }) {