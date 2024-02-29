import Heading from "@/components/ui/heading";
import ApprtsForm from "@/components/apprts/Form";
import { api } from "@/trpc/server";
import Container from "@/components/ui/container";
import { redirect } from "next/navigation";

export default async function New() {
  const apprenticeshipTypes = await api.apprts.getTypes.query();
  return (
    <>
      <Heading
        title="Fill out this form."
        description="this is required to submit a referal."
      ></Heading>
      <Container className="form">
        <ApprtsForm onCreate={() => redirect("/dash/apprts")} apprenticeshipTypes={apprenticeshipTypes} />
      </Container>
    </>
  );
}
