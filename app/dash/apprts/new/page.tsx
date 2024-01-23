import Heading from "@/components/ui/heading";
import ApprtsForm from "@/components/apprts/Form";
import { api } from "@/trpc/server";

export default async function New() {
  const apprenticeshipTypes = await api.apprts.getTypes.query();
  return (
    <>
      <Heading
        title="Fill out this form."
        description="this is required to submit a referal."
      ></Heading>
      <div className="form">
        <ApprtsForm apprenticeshipTypes={apprenticeshipTypes} />
      </div>
    </>
  );
}
