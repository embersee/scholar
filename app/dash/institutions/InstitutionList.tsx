import { api } from "@/trpc/react";
import AddInstutionForm from "./addInstutionForm";
import InstitutionsTable from "@/components/dash/InstitutionsTable";
import { RouterOutputs } from "@/trpc/shared";


function InstitutionList({ institutions }: { institutions: RouterOutputs["institutions"]["getInstitutions"] }) {
    const { data } = api.institutions.getInstitutions.useQuery(undefined, {
        initialData: institutions,
        refetchOnMount: false
    });
    return (
        <>
            <AddInstutionForm />
            <InstitutionsTable institutions={data} />
        </>
    )
}

export default InstitutionList