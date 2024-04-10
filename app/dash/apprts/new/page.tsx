import Heading from "@/components/ui/heading";
import ApprtsForm from "@/components/apprts/Form";
import { api } from "@/trpc/server";
import Container from "@/components/ui/container";

export default async function New() {
  const apprenticeshipTypes = await api.apprts.getTypes.query();
  return (
    <>
      <Heading
        title="Заполните эту форму."
        description="это необходимо для отправки направления."
      ></Heading>
      <Container className="form">
        <ApprtsForm apprenticeshipTypes={apprenticeshipTypes} />
      </Container>
    </>
  );
}
