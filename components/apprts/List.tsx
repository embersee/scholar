import { GetApprenticeship } from "@/server/schema/apprenticeship";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { api } from "@/trpc/server";
import { GetUser } from "@/server/schema/user";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";

type Props = {
  apprts: GetApprenticeship;
};
export default async function ApprtsList(props: Props) {
  if (!props.apprts.length) {
    return (
      <div className="text-center">
        <h2 className="mt-2 text-sm font-semibold">No apprenticeships.</h2>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new apprenticeship!
        </p>

        <Button asChild>
          <Link href="/dash/apprts/new" className="mt-2">
            Create
          </Link>
        </Button>
      </div>
    );
  }

  const user = (await api.user.getAuthedUserWithInstitution.query()) as GetUser;
  return (
    <ul>
      {props.apprts.map((apprt, i) => {
        //const user1 = {...user, FIO: "Ivanov Alexey Vladimirovich"};
        return (
          <li key={i}><ApprenticeShip user={user} apprt={apprt} /></li>
        )
      }
      )}
    </ul>
  );
}

type apprt = GetApprenticeship[0];

const ApprenticeShip = async ({ user, apprt }: { user: GetUser, apprt: apprt }) => {
  const apprtsTypes = await api.apprts.getTypes.query();
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" className="flex justify-between w-[100%] px-10 h-[64px] items-center">
          <div className="flex flex-col items-start">
            <div>{`@${user?.username}`}</div>
            <div className="hidden md:block">{user?.FIO}</div>
          </div>
          <div>{apprtsTypes.find((apprt_type)=> apprt_type.id === apprt.apprenticeshipTypeId )?.name}</div>
          <div>{`${apprt.signed}`}</div>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="flex flex-column justify-center items-center">
        <DrawerHeader>
          <DrawerTitle>Student Info</DrawerTitle>
          <DrawerDescription>View details</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-row items-center justify-center">
          <div className="p-10">FIO</div>
          <div className="p-10">Dates</div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
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
