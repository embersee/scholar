import {
    ColumnDef,
    ColumnFiltersState, flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState
} from "@tanstack/react-table";
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTableToolbar } from "./DataTableToolbar";
import { DataTablePagination } from "./DataTablePagination";
import { Role } from "@prisma/client";
import { DownloadIcon, Link } from "lucide-react";

interface DataTableProps<TData, TValue> {
    additionalFilters?: React.ReactNode;
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}
export function DataTable<TData, TValue>({
    columns,
    data,
    additionalFilters
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

    function handleFilterByRole(roles: Role[]) {
        table.setColumnFilters([
            {
                id: '',
                value: roles
            }
        ])
    }

    return (
        <div className="space-y-4">
            <DataTableToolbar additionalFilters={additionalFilters} table={table}/>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} colSpan={header.colSpan}
                                            style={{
                                                position: `${header.column.id == 'user_username' ? 'sticky' : 'static'}`,
                                                backgroundColor: "white",
                                                textAlign: "center",
                                                left: 0,
                                                zIndex: 5,
                                                width: "100%",
                                            }}>
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
                                    {row.getVisibleCells().map((cell: any) => (
                                        <TableCell key={cell.id} style={{
                                            position: `${cell.column.id == 'user_username' ? 'sticky' : 'static'}`,
                                            backgroundColor: "white",
                                            textAlign: "center",
                                            zIndex: 5,
                                            width: "100%",
                                        }}>
                                            {typeof cell.getValue() === 'object' && cell.getValue() instanceof Date
                                                ? new Intl.DateTimeFormat('ru-RU', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit',
                                                    hour12: false,
                                                    timeZone: 'UTC',
                                                }).format(cell.getValue() as Date)
                                                : (
                                                    (cell.column.id === 'referral' 
                                                    || cell.column.id === 'report')
                                                    && cell.getValue() !== ''
                                                )? 
                                                    <a  href={cell.getValue()} className="w-max p-2 h-10 flex gap-2 justify-center bg-secondary hover:bg-accent text-accent-foreground items-center rounded-sm mx-auto">
                                                        <DownloadIcon className="w-5 h-5"/>Скачать
                                                    </a> 
                                                : flexRender(
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
            <DataTablePagination table={table} />
        </div >
    )
}

