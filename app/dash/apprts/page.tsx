import Heading from "@/components/ui/heading";
import { api } from "@/trpc/server";
import ApprtsList from "@/components/apprts/List";

export default async function Apprenticeships() {
  const apprts = await api.apprts.getApprenticeships.query();

  return (
    <>
      <Heading
        title="My Apprenticeships"
        description="View your apprenticeships here."
      ></Heading>

      <ApprtsList apprts={apprts} />
    </>
  );
}
