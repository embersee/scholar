"use client";

import { LoginButton } from "@telegram-auth/react";
import { signIn } from "next-auth/react";

export default function SignIn({ botUsername }: { botUsername: string }) {
  return (
    <LoginButton
      buttonSize="medium"
      botUsername={botUsername}
      onAuthCallback={(data: any) => {
        void signIn("telegram-login", { callbackUrl: "/dash" }, data as any);
      }}
    />
  );
}
