
import ProifleEditForm from "@/components/profile/ProfileEditForm";
import Heading from "@/components/ui/heading";
import { GetUser } from "@/server/schema/user";
import { api } from "@/trpc/server";


const EditPage = async () => {
    const user = (await api.user.getAuthedUserWithInstitution.query()) as GetUser;
    const data = await api.institutions.getInstitutions.query();

    return <>
        <Heading title="Редактировать профиль" description="..."></Heading>
        <div>
            <ProifleEditForm onCreate={undefined} user={user} institutions={data} />
        </div>
    </>
}

export default EditPage;