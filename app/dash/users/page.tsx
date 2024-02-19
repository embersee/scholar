import UsersTable from "@/components/dash/UsersTable";
import Heading from "@/components/ui/heading";

export default async function Users() {
    return (
        <div className='w-full'>
            <Heading
                title="Users"
                description=""
            ></Heading>
            <UsersTable />
        </div>
    );
}
