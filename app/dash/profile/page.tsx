import Heading from "@/components/ui/heading";
import { api } from "@/trpc/server";
import { getUserAuth } from "@/server/auth";
import ProfileInfo from "@/components/profile/ProfileInfo";
// import { useEffect } from "react";

interface userProp { key: string, value: string }

export default async function Profile() {

  const { session } = await getUserAuth();
  if (!session) return null;
  const user = await api.user.getUserById.query({ telegram_id: session.user.id });
  if (!user) return null;
  //useEffect(()=> console.log(user), [user])

  return (
    <>
      <Heading
        title="Profile"
        description="Create or select which bot to manage here."
      ></Heading>
      <ProfileInfo user={user}/>
    </>
  );
}
