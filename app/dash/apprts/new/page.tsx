import Heading from "@/components/ui/heading";
import ApprtsForm from "@/components/apprts/Form";
import { api } from "@/trpc/server";
import { getUserAuth } from "@/server/auth";

export default async function New() {
  const apprenticeshipTypes = await api.apprts.getTypes.query();
  const {session} = await getUserAuth();
  if (!session) return null;
  
  return (
    <>
      <Heading
        title="Fill out this form."
        description="this is required to submit a referal."
      ></Heading>
      <div className="form">
        <ApprtsForm session={session} apprenticeshipTypes={apprenticeshipTypes}/>
      </div>
    </>
  );
}
