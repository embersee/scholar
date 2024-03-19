'use client'

import ApprtsForm from "@/components/apprts/Form";
import UserEditForm from "@/components/dash/UserEditForm";
import { GetUser, User } from "@/server/schema/user";
import { api } from "@/trpc/react";

import { useState } from "react";
import ProifleEditForm from "@/components/profile/ProfileEditForm";
import { useRouter } from "next/navigation";

function RegList() {
    const [status, setStatus] = useState(false);
    const user = api.user.getAuthedUserWithInstitution.useQuery();
    const institions = api.institutions.getInstitutions.useQuery();
    const apprenticeshipTypes = api.apprts.getTypes.useQuery();
    const router = useRouter();
    return (
        <>
            {!status && institions.data && user.data && (
                <ProifleEditForm
                    onCreate={() => setStatus(true)}
                    user={user.data as GetUser}
                    institutions={institions.data}
                />
            )}
            {status && apprenticeshipTypes.data && (
                <ApprtsForm
                    apprenticeshipTypes={apprenticeshipTypes.data}
                />
            )}
        </>
    );
}

export default RegList;