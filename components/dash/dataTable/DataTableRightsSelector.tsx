"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Table } from "@tanstack/react-table";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Role } from "@prisma/client";
import { useEffect, useState } from "react";

interface DataTableViewOptionsProps {
    onChange: (roles: Role[]) => void
}

export function DataTableRightsSelector({
    // table,
    onChange
}: DataTableViewOptionsProps) {
    const [selectedRoles, setSelectedRoles] = useState<Role[]>(Object.values(Role));

    useEffect(() => {
        onChange(selectedRoles)
    }, [selectedRoles])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto  hidden flex "
                >
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Фильтр по правам
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuLabel>Роли</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(Object.keys(Role) as Role[])
                    .map((column) => {
                        return (
                            <DropdownMenuCheckboxItem
                                key={column}
                                className="capitalize"
                                checked={selectedRoles.includes(column)}
                                onCheckedChange={() => setSelectedRoles(prev => prev.includes(column) ? prev.filter(role => role !== column) : [...prev, column])}
                            >
                                {column}
                            </DropdownMenuCheckboxItem>
                        );
                    })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}