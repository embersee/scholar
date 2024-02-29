import UsersTable from "@/components/dash/UsersTable";
import Heading from "@/components/ui/heading";
import UsersList from "./UsersList";
import { api } from "@/trpc/server";

export const metadata = {
    title: 'Users',
}

export default async function Users() {
    const users = await api.user.getUsers.query();

    return (
        <div className='w-full'>
            <Heading
                title="Users"
                description=""
            />
            <UsersList users={users} />
        </div>
    );
}
