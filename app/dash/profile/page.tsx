import Heading from "@/components/ui/heading";
import { api } from "@/trpc/server";
import { getUserAuth } from "@/server/auth";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ApprtsList from "@/components/apprts/List";
import Container from "@/components/ui/container";

export default async function Profile() {

  const { session } = await getUserAuth();
  if (!session) return null;
  const user = await api.user.getUserById.query({ telegram_id: session.user.id });
  if (!user) return null;
  const apprts = await api.apprts.getApprenticeships.query();

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
      </div>
    </>
  );
}
