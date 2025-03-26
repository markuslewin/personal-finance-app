"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import * as ActionsMenu from "~/app/_components/actions-menu";
import * as DeleteDialog from "~/app/(main)/pots/_components/delete-dialog";

type PotActionsProps = {
  pot: {
    id: string;
    name: string;
  };
};

const PotActions = ({ pot }: PotActionsProps) => {
  const router = useRouter();
  // todo: Might want to hoist dialog to page
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <ActionsMenu.Root>
        <ActionsMenu.Trigger />
        <ActionsMenu.Portal>
          <ActionsMenu.Content>
            <ActionsMenu.Item
              onSelect={() => {
                router.push(`/pots/${pot.id}/edit`);
              }}
            >
              Edit Pot
            </ActionsMenu.Item>
            <ActionsMenu.ItemSeparator />
            <ActionsMenu.Item
              intent="destroy"
              onSelect={() => {
                setIsDeleteDialogOpen(true);
              }}
            >
              Delete Pot
            </ActionsMenu.Item>
          </ActionsMenu.Content>
        </ActionsMenu.Portal>
      </ActionsMenu.Root>
      <DeleteDialog.Root
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <DeleteDialog.Portal pot={pot} />
      </DeleteDialog.Root>
    </>
  );
};

export default PotActions;
