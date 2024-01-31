import Heading from "@/components/ui/heading";
import { api } from "@/trpc/server";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ApprtsList from "@/components/apprts/List";
import Container from "@/components/ui/container";
import { GetUser } from "@/server/schema/user";

export default async function Profile() {

  const apprts = await api.apprts.getApprenticeships.query();
  const user = (await api.user.getAuthedUserWithInstitution.query()) as GetUser;

  return (
    <>
      <Heading
        title="Profile"
        description="Create or select which bot to manage here."
      ></Heading>
      <div className="grid grid-flow-row md:grid-flow-col gap-4">
        <ProfileInfo user={user} />
        <div className="flex flex-col gap-4 md:gap-6">
          <Container className="justify-center">
            <ApprtsList apprts={apprts} />
          </Container>
        </div>
      </div>
    </>
  );
}
