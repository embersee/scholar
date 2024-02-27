import React from 'react';
import Heading from "@/components/ui/heading";
import { api } from "@/trpc/server";
import CuratorList from './CuratorList';

async function Curators() {
    const curators = await api.curators.getCurators.query();
    return (
        <div>
            <Heading
                title="Curators"
                description="View all curators here."
            />
            <CuratorList curators={curators} />
        </div>
    );
};

export default Curators;
