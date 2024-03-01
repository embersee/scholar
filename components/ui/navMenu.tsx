'use client'

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils";
import Link from "next/link";
import * as React from "react";

import s from "./navMenu.module.css";

function NavMenu() {
    return (
        <NavigationMenu className={s.nav_menu}>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger >Menu</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="z-[100] grid w-[300px] p-4 grid-cols-2  ">
                            <ListItem href="/dash/curators" title="Curators" />
                            <ListItem href="/dash/users" title="Users" />
                            <ListItem href="/dash/institutions" title="Institutions" />
                            <ListItem href="/dash/apprts" title="Apprenticeships" />
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

            </NavigationMenuList>
        </NavigationMenu>
    )
}

export default NavMenu


const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>

                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"