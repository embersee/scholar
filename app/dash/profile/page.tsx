import Heading from "@/components/ui/heading";
import { api } from "@/trpc/server";
import ProfileForm from "@/components/profile/Form";
import { getUserAuth } from "@/server/auth";
import { GetUser } from "@/server/schema/user";

export default async function Profile() {
  const data = await api.institutions.getInstitutions.query();
  const user = (await api.user.getAuthedUserWithInstitution.query()) as GetUser;

  return (
    <>
      <Heading
        title="Profile"
        description="Create or select which bot to manage here."
      ></Heading>
      <div className="form">
        <ProfileForm user={user} institutions={data} />
      </div>
    </>
  );
}
