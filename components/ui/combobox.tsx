"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { InputProps } from "@/components/ui/input";
import { SelectProps } from "@radix-ui/react-select";
import { forwardRef } from "react";
import { Calendar } from "@/components/ui/calendar";

interface ComboboxProps {
  names: { button: string; empty: string; search: string };
  options: { label: string; value: string }[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string
}

export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
  ({ names, options, value, onChange }: ComboboxProps, ref) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" className="justify-between w-[100%]">
            {value
              ? options.find((framework) => framework.value === value)?.label
              : names.button}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput
              placeholder="Search framework..."
              ref={ref}
              required
            />
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {options.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === framework.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);

Combobox.displayName = "Combobox";
