"use client";

import { signOut } from "next-auth/react";
import { Button } from "../ui/button";

export default function SignOut() {
  return (
    <Button variant="destructive" onClick={() => signOut({ callbackUrl: "/" })}>
      Sign Out
    </Button>
  );
}
