"use client";

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerClose,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import autoAnimate from "@formkit/auto-animate";
import { api } from "@/trpc/react";
import Container from "../ui/container";
import { ApprenticeshipType } from "@prisma/client";
import ApprtTypeCreateForm from "./ApprtTypeCreateForm";
import { Cross1Icon } from "@radix-ui/react-icons";

const ApprtsTypeList = () => {
  const parent = useRef(null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  const apprtTypesList = api.apprts.getTypes.useQuery();
  console.log(apprtTypesList);
  const apprtTypeRemove = api.apprts.removeApprtType.useMutation({
    onError: console.error,
    onSuccess: () => apprtTypesList.refetch(),
  });

  const removeApprtType = (apprtTypeId: string) => {
    if (confirm("Are you shure?")) apprtTypeRemove.mutate({ id: apprtTypeId });
  };

  return (
    <Container className="flex-col gap-4">
      <div>Apprenticeship types</div>
      {apprtTypesList.data && apprtTypesList.data.length > 0 ? (
        <>
          <ul>
            {apprtTypesList.data.map((apprtType: ApprenticeshipType) => (
              <li
                className="flex flex-row items-center justify-between overflow-hidden pl-10 dark:border-none"
                key={apprtType.id}
              >
                <div>{apprtType.name}</div>
                <Button
                  variant="ghost"
                  className="hover:bg-secondary"
                  onClick={() => removeApprtType(apprtType.id)}
                >
                  x
                </Button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="text-center font-medium">
          Still No Apprenticeship Types Yet
        </div>
      )}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button>Add</Button>
        </DrawerTrigger>
        <DrawerContent className="flex flex-col items-center">
          <DrawerHeader>
            <DrawerTitle>New Apprenticeship type</DrawerTitle>
            <DrawerDescription>
              Make changes to your profile here. Click save when you're done.
            </DrawerDescription>
          </DrawerHeader>
          <ApprtTypeCreateForm
            onCreate={() => {
              apprtTypesList.refetch();
              setOpen(false);
            }}
          />
          <DrawerFooter>
            <DrawerClose asChild>
              <Button className="w-72" variant="outline">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Container>
  );
};

export default ApprtsTypeList;
