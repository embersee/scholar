import Heading from "@/components/ui/heading";
import DashList from "./DashList";
import { api } from "@/trpc/server";
import { StudentDashBoard } from "@/components/dash/StudentDashBoard";

export default async function Dash() {
  const apprtTypes = await api.apprts.getTypes.query();
  const institutions = await api.institutions.getInstitutions.query();
  const user = await api.user.getAuthedUserWithInstitution.query();

  return (
    <>
      <Heading
        title="Dash"
        description={
          user?.role !== 'STUDENT'?
          "Добро пожаловать в Практика.ру! Место, где вы сможете найти задания, соответствующие вашим интересам и направлению обучения.":
          "Создайте или выберите бота для управления здесь."
        }
      ></Heading>
      {!(user?.role !== 'STUDENT') && <DashList institutions={institutions} apprtTypes={apprtTypes} />}
      {(user?.role !== 'STUDENT') && <StudentDashBoard />}


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
