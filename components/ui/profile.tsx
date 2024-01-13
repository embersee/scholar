"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import Link from "next/link";

export const Profile = ({ name, image }: { name: string; image: string }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-8  items-center  justify-center space-x-2 rounded-sm px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
        <p>@{name}</p>
        <Avatar>
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>{name?.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/dash/profile">
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </Link>
        <Link href="/dash/apprts">
          <DropdownMenuItem>Apprenticeships</DropdownMenuItem>
        </Link>
        <Link href="/dash/settings">
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </Link>

        <DropdownMenuItem
          className=" bg-destructive/70 text-destructive-foreground shadow-sm"
          onClick={() => signOut()}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
