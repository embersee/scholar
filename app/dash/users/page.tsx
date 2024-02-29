import UsersTable from "@/components/dash/UsersTable";
import Heading from "@/components/ui/heading";
import { api } from "@/trpc/server";

export default async function Users() {
    const usersList = await api.user.getUsersWithInstitution.query();

    return (
        <div className='w-full'>
            <Heading
                title="Users"
                description=""
            ></Heading>
            <UsersTable usersList={usersList} />
        </div>
    );
}
