import Heading from "@/components/ui/heading";
import ApprtsForm from "@/components/apprts/Form";
import { getUserAuth } from "@/server/auth";
import Container from "@/components/ui/container";
//import { createContext } from "react";

export default async function New() {
  const {session} = await getUserAuth();
  if (!session) return null;
  
  return (
    <>
      <Heading
        title="Fill out this form."
        description="this is required to submit a referal."
      ></Heading>
      <Container className="justify-center"><ApprtsForm session={session}/></Container>
    </>
  );
}
