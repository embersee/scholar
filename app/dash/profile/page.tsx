import Heading from "@/components/ui/heading";
import { api } from "@/trpc/server";
import { getUserAuth } from "@/server/auth";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ApprtsList from "@/components/apprts/List";
import Container from "@/components/ui/container";
 import ProfileForm from "@/components/profile/Form";
 import { GetUser } from "@/server/schema/user";

export default async function Profile() {

  const { session } = await getUserAuth();
  if (!session) return null;
  const user = await api.user.getUserById.query({ telegram_id: session.user.id });
  if (!user) return null;
  const apprts = await api.apprts.getApprenticeships.query();
  const data = await api.institutions.getInstitutions.query();
  const user_1 = (await api.user.getAuthedUserWithInstitution.query()) as GetUser;

  return (
    <>
      <Heading
        title="Profile"
        description="Create or select which bot to manage here."
      ></Heading>
      <div className="grid grid-flow-row md:grid-flow-col gap-3">
        <ProfileInfo user={user} />
        <Container className="justify-center">
          <ApprtsList apprts={apprts} />
        </Container>
        
        <div className="form">
          <ProfileForm user={user_1} institutions={data} />
        </div>
      </div>
    </>
  );
}
