"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button"; 
import { DataTableViewOptions } from "./DataTableViewOptions"; 
import { Role } from "@prisma/client";


interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    additionalFilters?: React.ReactNode;
}

export function DataTableToolbar<TData>({
    additionalFilters,
    table,

}: DataTableToolbarProps<TData>) {
    const isFiltered =
        table.getPreFilteredRowModel().rows.length >
        table.getFilteredRowModel().rows.length;

    // const { data: eduNames } = api.form.getEduNames.useQuery();

    return (
        <div className="flex items-center justify-between">
            {/* <div className="flex flex-1 items-center space-x-2"> */}


                {/* <Input
                    placeholder="Поиск по ФИО..."
                    value={(table.getColumn("FIO")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("FIO")?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                /> */}

                {/* <Select
                    value={
                        (table.getColumn("eduName")?.getFilterValue() as string) ??
                        "Выберете учереждение"
                    }
                    onValueChange={(name) =>
                        table.getColumn("eduName")?.setFilterValue(name)
                    }
                >
                    <SelectTrigger className="h-8 w-[250px] text-black lg:w-[350px]">
                        <SelectValue
                            placeholder="Фильтрация по учереждению..."
                            defaultValue="Выберете учереждение"
                        />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="Выберете учереждение" disabled>
                                Выберете учереждение
                            </SelectItem>
                            <Separator />
                            <SelectLabel>Учебные учереждения</SelectLabel>

                            {/* {eduNames?.map((item: { id: Key | null | undefined; name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | PromiseLikeOfReactNode | null | undefined; }) => (
                                <SelectItem key={item.id} value={item.name as string}>
                                    {item.name}
                                </SelectItem>
                            ))} */}
                {/* </SelectGroup>
                    </SelectContent>
                </Select> */}

                {/* {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Очистить
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>  */}
            {additionalFilters && additionalFilters}
            <DataTableViewOptions table={table} />
        </div>
    );
}