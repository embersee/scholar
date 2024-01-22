import ProifleEditForm from "@/components/profile/ProfileEditForm";
import Heading from "@/components/ui/heading";
import { getUserAuth } from "@/server/auth";
import { api } from "@/trpc/server";

const EditPage = async () => {
    const {session} = await getUserAuth();
    if (!session) return null;
    const user = await api.user.getUserById.query({telegram_id: session.user.id});
    if (!user) return null;
    return <>
        <Heading title="Edit Profile" description="..."></Heading>
        <ProifleEditForm user={user}/>
    </>
}

export default EditPage;