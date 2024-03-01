

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
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will give that user admin rights
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
              onClick={onClickAction}
            >
              Make admin
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };