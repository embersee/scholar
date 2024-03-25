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
import { Institution } from "@prisma/client";
import InstitutionCreateForm from "./InstitutionCreateForm";
import { toast } from "../ui/use-toast";

const InstitutionList = ({ institutions }: { institutions: Institution[] }) => {
  const parent = useRef(null);
  const trpcClient = api.useUtils();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);



  const institutionRemove = api.institutions.removeInstitution.useMutation({
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
        description: 'Учебное заведение успешно удалено'
      })
      trpcClient.institutions.getInstitutions.refetch();
    },
  });

  const removeInstitution = (institutionId: string) => {
    if (confirm("Вы уверены?"))
      institutionRemove.mutate({ id: institutionId });
  };

  return (
    <Container className="flex-col gap-4">
      <div>Учебные заведения</div>
      {institutions ? (
        <>
          <ul>
            {institutions.map((institution: Institution) => (
              <li
                className="flex flex-row items-center justify-between overflow-hidden pl-10 dark:border-none"
                key={institution.id}
              >
                <div>{institution.name}</div>
                <Button
                  variant="ghost"
                  className="hover:bg-secondary"
                  onClick={() => removeInstitution(institution.id)}
                >
                  x
                </Button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="text-center font-medium">Учебных заведений пока нет</div>
      )}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button>Добавить</Button>
        </DrawerTrigger>
        <DrawerContent className="flex flex-col items-center">
          <DrawerHeader>
            <DrawerTitle>Новое учебное заведение</DrawerTitle>
            <DrawerDescription>
              {"Внесите изменения в свой профиль здесь. Нажмите кнопку сохранить, когда закончите."}
            </DrawerDescription>
          </DrawerHeader>
          <InstitutionCreateForm
            onCreate={() => {
              trpcClient.institutions.getInstitutions.refetch();
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

export default InstitutionList;
