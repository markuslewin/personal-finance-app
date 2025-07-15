"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import * as ActionsMenu from "~/app/_components/actions-menu";
import * as DeleteDialog from "~/app/(main)/budgets/_components/delete-dialog";
import { useProgress } from "~/app/_components/progress";

type BudgetActionsProps = {
  budget: {
    id: string;
    category: {
      name: string;
    };
  };
};

const BudgetActions = ({ budget }: BudgetActionsProps) => {
  const router = useRouter();
  // todo: Might want to hoist dialog to page
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const progress = useProgress();

  return (
    <>
      <ActionsMenu.Root>
        <ActionsMenu.Trigger />
        <ActionsMenu.Portal>
          <ActionsMenu.Content>
            <ActionsMenu.Item
              onSelect={() => {
                startTransition(() => {
                  progress.start();
                  router.push(`/budgets/${budget.id}/edit`);
                });
              }}
            >
              Edit Budget
            </ActionsMenu.Item>
            <ActionsMenu.ItemSeparator />
            <ActionsMenu.Item
              intent="destroy"
              onSelect={() => {
                setIsDeleteDialogOpen(true);
              }}
            >
              Delete Budget
            </ActionsMenu.Item>
          </ActionsMenu.Content>
        </ActionsMenu.Portal>
      </ActionsMenu.Root>
      <DeleteDialog.Root
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <DeleteDialog.Portal budget={budget} />
      </DeleteDialog.Root>
    </>
  );
};

export default BudgetActions;
