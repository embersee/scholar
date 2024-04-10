'use client'

import { RouterOutputs } from "@/trpc/shared"

import ApprtsTable from "@/components/dash/ApprtsWithUsersTable";
import ApprtsList from "@/components/apprts/List";
import { api } from "@/trpc/react";
interface ApprtsProps {
    apprts: RouterOutputs["apprts"]["getApprenticeships"],
    apprtsWithUsers: RouterOutputs["apprts"]["getApprenticeshipsWithUsers"]
    user: RouterOutputs["user"]["getAuthedUserWithInstitution"]
}
function ApprtsTables(props: ApprtsProps) {
    const { apprts, apprtsWithUsers, user } = props
    const { data: apprtsData } = api.apprts.getApprenticeships.useQuery(undefined, {
        initialData: apprts,
        refetchOnMount: false
    });
    const { data: apprtsWithUsersData } = api.apprts.getApprenticeshipsWithUsers.useQuery(undefined, {
        initialData: apprtsWithUsers,
        refetchOnMount: false
    });
    return (
        <>
            {
                user?.role !== "STUDENT" ?
                    <ApprtsList apprts={apprtsData} user={user} /> :
                    <ApprtsTable apprts={apprtsWithUsersData} />
            }
        </>
    )
}

export default ApprtsTables