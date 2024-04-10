'use client'

import CuratorsTable from "@/components/dash/CuratorsTable"
import AddCuratorForm from "./addCuratorForm"
import { RouterOutputs } from "@/trpc/shared"
import { api } from "@/trpc/react";
function CuratorList({ curators }: { curators: RouterOutputs["curators"]["getCurators"] }) {
    const { data } = api.curators.getCurators.useQuery(undefined, {
        initialData: curators,
        refetchOnMount: false
    });
    return (
        <>
            <AddCuratorForm />
            <CuratorsTable curators={data} />
        </>
    )
}

export default CuratorList