'use client'

import React from 'react';
import Heading from "@/components/ui/heading";
import {api} from "@/trpc/react";
import AddCuratorForm from "@/app/dash/curators/addCuratorForm";
import CuratorsTable from "@/components/dash/CuratorsTable";

const Curators = async () => {
    const curators = api.curators.getCurators.useQuery();

    console.log(curators.data);

    const refetch = () => {
        curators.refetch();
    };

    return (
        <div>
            <Heading
                title="Curators"
                description="View all curators here."
            />

            <AddCuratorForm refetch={refetch}/>
            <CuratorsTable refetch={refetch} curators={curators.data || []}/>
        </div>
    );
};

export default Curators;
