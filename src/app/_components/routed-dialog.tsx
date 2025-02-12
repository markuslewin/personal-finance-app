"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { type ComponentPropsWithRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface RoutedDialogProps extends ComponentPropsWithRef<typeof Dialog.Root> {}

const RoutedDialog = (props: RoutedDialogProps) => {
  const router = useRouter();

  return (
    <Dialog.Root
      open={true}
      onOpenChange={(open) => {
        if (!open) {
          router.back();
        }
      }}
      {...props}
    />
  );
};

export default RoutedDialog;
