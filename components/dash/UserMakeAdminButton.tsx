

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
  import { Button } from "../ui/button";
  import { XCircle } from "lucide-react";
  
  export const UserMakeAdminButton = ({
    children,
    onClickAction,
  }: {
    children: React.ReactNode | string;
    onClickAction: () => void;
  }) => {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            variant="destructive"
            // size="lg"
            className="space-x-1 pr-5 "
          >
            {/* <XCircle className="h-4" /> */}
            <span>{children}</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="z-[250]">
          <AlertDialogHeader>
            <AlertDialogTitle>Вы абсолютно уверены?</AlertDialogTitle>
            <AlertDialogDescription>
            Это действие нельзя отменить. Это даст этому пользователю права администратора
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
              onClick={onClickAction}
            >
              Сделать администратором
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };