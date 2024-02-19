'use client'

import Heading from "@/components/ui/heading";

import {api} from "@/trpc/react";
import AddInstutionForm from "@/app/dash/institutions/addInstutionForm";
import InstitutionsTable from "@/components/dash/InstitutionsTable";
import {Institution} from "@/server/schema/institution";



export default  function Institutions() {

    const institionsList = api.institutions.getInstitutions.useQuery();

    if (institionsList.isLoading) {
        return <div>Loading...</div>;
    }
    const refetch = () => {
        institionsList.refetch();
    };

    return (
        <div className='w-full'>
            <Heading
                title="Institutions"
                description=""
            ></Heading>
             <AddInstutionForm refetch={refetch}/>
            {institionsList.data && <InstitutionsTable  refetch={refetch} institutions={institionsList.data}/>}
        </div>
    );
}
