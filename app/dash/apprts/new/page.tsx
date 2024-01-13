import Heading from "@/components/ui/heading";
import ApprtsForm from "@/components/apprts/Form";

export default async function New() {
  return (
    <>
      <Heading
        title="Fill out this form."
        description="this is required to submit a referal."
      ></Heading>
      <ApprtsForm />
    </>
  );
}
