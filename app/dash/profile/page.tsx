import Heading from "@/components/ui/heading";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
//import { api } from "@/trpc/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";
import { getUserAuth } from "@/server/auth";
import Image from "next/image";
import { useEffect } from "react";

interface userProp { key: string, value: string }

export default async function Profile() {
  const userProps: userProp[] = [
    { key: "name", value: "Alex" },
    { key: "git", value: "https://github.com/AJIEXAHDPO" },
    { key: "studying place", value: "SUT" },
    { key: "practice type", value: "Next.js" },
    { key: "Email", value: "alesha.iv03@gmail.com" },
  ]

  const { session } = await getUserAuth();
  if (!session) return null;
  const user = await api.user.getUserById.query({ telegram_id: session.user.id });
  if (!user) return null;
  const keys = Object.keys(user);
  //useEffect(()=> console.log(user), [user])

  return (
    <>
      <Heading
        title="Profile"
        description="Create or select which bot to manage here."
      ></Heading>
      <div className="flex bg-white rounded-sm p-10 border-solid border-2 border-gray-100 dark:bg-slate-950 dark:border-none">
        <div className="flex flex-col w-max">
          <Avatar className="w-28 h-28 my-6">
            <AvatarImage src={session.user.image as string}></AvatarImage>
            <AvatarFallback>AJ</AvatarFallback>
          </Avatar>
          <div className="flex flex-row my-6 flex-nowrap">
            <div className="pr-8 font-bold dark:text-slate-300 capitalize">{user.display_name}</div>
          </div>
          {Object.keys(user).map((key: string) =>
            <div className="flex flex-row my-6 flex-nowrap">
              <div className="pr-8 font-bold dark:text-slate-300 capitalize">{key}</div>
              <div className="dark:text-slate-400">{user[key as keyof typeof user]?.toString()}</div>
            </div>
          )}
          <Link href="/dash/profile/edit" className="my-6 w-max">
            <Button variant="default" size="lg">Edit</Button>
          </Link>
        </div>
      </div>
      
    </>
  );
}
