'use client'

import { RouterOutputs } from "@/trpc/shared"
import { api } from "@/trpc/react";
import ApprtsTypeList from "@/components/dash/ApprtsTypeList";
import InstitutionList from "@/components/dash/InstitutionList";


interface DashListProps {
    apprtTypes: RouterOutputs["apprts"]["getTypes"],
    institutions: RouterOutputs["institutions"]["getInstitutions"]
}

function DashList(props: DashListProps) {
    const { apprtTypes, institutions } = props;;
    const { data: types } = api.apprts.getTypes.useQuery(undefined, {
        initialData: apprtTypes,
        refetchOnMount: false
    });
    const { data: institutionsList } = api.institutions.getInstitutions.useQuery(undefined, {
        initialData: institutions,
        refetchOnMount: false
    });
    return (
        <div className="grid gap-2">
            <ApprtsTypeList apprtsTypes={types} />
            <InstitutionList institutions={institutionsList} />
        </div>
    )
}

export default DashList