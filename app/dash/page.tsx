import ApprtsTypeList from "@/components/dash/ApprtsTypeList"
import InstitutionList from "@/components/dash/InstitutionList";
import Heading from "@/components/ui/heading";

export default async function Dash() {
  return (
    <>
      <Heading
        title="Dash"
        description="Create or select which bot to manage here."
      ></Heading>

      <div className="grid gap-2">
        <ApprtsTypeList />
        <InstitutionList />
      </div>

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
