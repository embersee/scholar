import Nav from "@/components/ui/nav";
import { checkAuth } from "@/server/auth";
import React from "react";

export default async function DashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkAuth();

  return (
    <>
      <main>
        <Nav />
        <div className="page">{children}</div>
      </main>
    </>
  );
}
