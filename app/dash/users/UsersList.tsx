

'use client'

import UsersTable from "@/components/dash/UsersTable"
import { RouterOutputs } from "@/trpc/shared"
import { api } from "@/trpc/react";

function UsersList({ users }: { users: RouterOutputs["user"]["getUsers"] }) {
    const { data } = api.user.getUsers.useQuery(undefined, {
        initialData: users,
        refetchOnMount: false
    });
    return (
        <>
            <UsersTable users={data} />
        </>
    )
}

export default UsersList;