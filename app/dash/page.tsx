import Heading from "@/components/ui/heading";
import DashList from "./DashList";
import { api } from "@/trpc/server";

export default async function Dash() {
  const apprtTypes = await api.apprts.getTypes.query();
  const institutions = await api.institutions.getInstitutions.query();

  return (
    <>
      <Heading
        title="Dash"
        description="Create or select which bot to manage here."
      ></Heading>
      <DashList institutions={institutions} apprtTypes={apprtTypes} />


      {/*<BotList bots={bots} />*/}

      {/*{!bots.length && (*/}
      {/*  <div className="text-center">*/}
      {/*    <h2 className="mt-2 text-sm font-semibold">No bots</h2>*/}
      {/*    <p className="mt-1 text-sm text-gray-500">*/}
      {/*      Get started by creating a new bot.*/}
      {/*    </p>*/}
      {/*    <div className="mt-6">*/}
      {/*      <CreateBotButton />*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*)}*/}

      {/*<CreateProjectVale />*/}
    </>
  );
}
