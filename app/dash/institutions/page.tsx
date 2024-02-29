
import Heading from "@/components/ui/heading";
import { api } from "@/trpc/server";
import AddInstutionForm from "@/app/dash/institutions/addInstutionForm";
import InstitutionsTable from "@/components/dash/InstitutionsTable";
import InstitutionList from "./InstitutionList";




async function Institutions() {
    const institions = await api.institutions.getInstitutions.query();

    return (
        <div className='w-full'>
            <Heading
                title="Institutions"
                description=""
            ></Heading>
            <InstitutionList institutions={institions} />

        </div>
    );
}

export default Institutions;