'use client'
import { GetApprenticeship } from "@/server/schema/apprenticeship";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { api } from "@/trpc/react";
import { GetUser } from "@/server/schema/user";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import Container from "../ui/container";
import { RouterOutputs } from "@/trpc/shared";


type Props = {
  apprts: GetApprenticeship;
  user: RouterOutputs["user"]["getAuthedUserWithInstitution"];
};
export default function ApprtsList(props: Props) {
  if (!props.apprts.length) {
    return (
      <div className="text-center">
        <h2 className="mt-2 text-sm font-semibold">Здесь пока нет практик.</h2>
        <p className="mt-1 text-sm text-gray-500">
          Начни с создания новой практики!
        </p>

        <Button asChild>
          <Link href="/dash/apprts/new" className="mt-2">
            Создать
          </Link>
        </Button>
      </div>
    );
  }

  // const user = (await api.user.getAuthedUserWithInstitution.query()) as GetUser;
  return (
    <ul>
      {props.apprts.map((apprt, i) => {
        //const user1 = {...user, FIO: "Ivanov Alexey Vladimirovich"};
        return (
          <li key={i}><ApprenticeShip user={props.user as GetUser} apprt={apprt} /></li>
        )
      }
      )}
    </ul>
  );
}

type apprt = GetApprenticeship[0];

const ApprenticeShip = async ({ user, apprt }: { user: GetUser, apprt: apprt }) => {
  const apprtsTypes = await api.apprts.getTypes.useQuery();
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" className="flex justify-between w-[100%] px-10 h-[64px] items-center">
          <div className="flex flex-col items-start">
            <div>{`@${user?.username}`}</div>
            <div className="hidden md:block">{user?.FIO}</div>
          </div>
          {apprtsTypes.data && <div>
            {apprtsTypes.data.find((apprt_type) => apprt_type.id === apprt.apprenticeshipTypeId)?.name}
          </div>}
          <div>{`${apprt.signed}`}</div>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="flex flex-column justify-center items-center">
        <DrawerHeader>
          <DrawerTitle>Информация о студентах</DrawerTitle>
          <DrawerDescription>View details</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-row items-center justify-center">
          <div className="p-10">ФИО</div>
          <div className="p-10">Даты</div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Отмена</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

//enum Apprt_status {
//  waiting
//  closed
//  approved
//  failed
//}
