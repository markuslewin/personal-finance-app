"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { startTransition, type ComponentPropsWithRef } from "react";
import { type AppEvent, useAppEvent } from "~/app/_components/app-event";

interface RoutedDialogProps extends ComponentPropsWithRef<typeof Dialog.Root> {
  onCloseAppEvent: AppEvent;
}

const RoutedDialog = ({ onCloseAppEvent, ...props }: RoutedDialogProps) => {
  const router = useRouter();
  const { setAppEvent } = useAppEvent();

  return (
    <Dialog.Root
      open={true}
      onOpenChange={(open) => {
        if (!open) {
          startTransition(() => {
            router.back();
            setAppEvent(onCloseAppEvent);
          });
        }
      }}
      {...props}
    />
  );
};

export default RoutedDialog;
