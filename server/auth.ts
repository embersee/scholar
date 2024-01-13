import { DefaultSession, NextAuthOptions } from "next-auth";
import NextAuth, { getServerSession } from "next-auth/next";
import { env } from "@/env.mjs";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthDataValidator, objectToAuthDataMap } from "@telegram-auth/server";

import { db } from "@/server/db";
import { redirect } from "next/navigation";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      username: string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "telegram-login",
      name: "Telegram Login",
      credentials: {},
      async authorize(credentials, req) {
        const validator = new AuthDataValidator({
          botToken: `${env.BOT_TOKEN}`,
        });

        const data = objectToAuthDataMap(req.query || {});

        const user = await validator.validate(data);

        if (!user) return null;

        const visitor = {
          id: user.id.toString(),
          telegram_id: user.id.toString(),
          username: user.username ?? "hidden username",
          display_name: [user.first_name, user.last_name || ""].join(" "),
          image: user.photo_url,
        };

        const exists = await db.user.findFirst({
          where: {
            telegram_id: visitor.telegram_id,
          },
        });

        if (exists) return {
          ...visitor, name: visitor.username
        };

        await db.user.create({
          data: visitor,
        });

        return visitor;
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  jwt: {
    maxAge: 15 * 24 * 30 * 60, // 15 days
  },
  pages: {
    error: "/error",
    newUser: "/register",
    signOut: "/",
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);

export const getUserAuth = async () => {
  const session = await getServerSession(authOptions);
  return { session };
};

export const checkAuth = async () => {
  const { session } = await getUserAuth();
  if (!session) redirect("/");
};
