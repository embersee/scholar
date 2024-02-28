import Nav from "@/components/ui/nav";
import { checkAuthForRegistation } from "@/server/auth";

import React from "react";

export default async function RegistationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await checkAuthForRegistation();

    return (
        <>
            <main>
                <div className={`${''}`}>{children}</div>
            </main>
        </>
    );
}
