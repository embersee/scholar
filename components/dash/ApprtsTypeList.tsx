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
import { toast } from "../ui/use-toast";

const ApprtsTypeList = ({ apprtsTypes }: { apprtsTypes: ApprenticeshipType[] }) => {
  const parent = useRef(null);
  const trpcClient = api.useUtils();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);


  const apprtTypeRemove = api.apprts.removeApprtType.useMutation({
    onMutate: () => {
      toast({
        title: '🔄 Удаление...',
      })
    },
    onError: (e) => {
      toast({
        title: '🚫 Ошибка',
        description: e.message
      })
    },
    onSuccess: () => {
      toast({
        title: '✅ Успех',
        description: 'Тип практики успешно удалён'
      })
      trpcClient.apprts.getTypes.refetch()
    },

  });

  const removeApprtType = (apprtTypeId: string) => {
    if (confirm("Вы уверены?")) apprtTypeRemove.mutate({ id: apprtTypeId });
  };

  return (
    <Container className="flex-col gap-4">
      <div>Типы практики</div>
      {apprtsTypes ? (
        <>
          <ul>
            {apprtsTypes.map((apprtType: ApprenticeshipType) => (
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
          По-прежнему нет типов практики.
        </div>
      )}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button>Добавить</Button>
        </DrawerTrigger>
        <DrawerContent className="flex flex-col items-center">
          <DrawerHeader>
            <DrawerTitle>Новый тип практики</DrawerTitle>
            <DrawerDescription>
              {"Внесите изменения в свой профиль здесь. Нажмите сохранить, когда закончите."}
            </DrawerDescription>
          </DrawerHeader>
          <ApprtTypeCreateForm
            onCreate={() => {
              trpcClient.apprts.getTypes.refetch()
              setOpen(false);
            }}
          />
          <DrawerFooter>
            <DrawerClose asChild>
              <Button className="w-72" variant="outline">
                Отмена
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Container>
  );
};

export default ApprtsTypeList;
