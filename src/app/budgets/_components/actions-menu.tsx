"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cx } from "class-variance-authority";
import { useRouter } from "next/navigation";
import { useState, type ComponentPropsWithRef } from "react";
import * as DeleteDialog from "~/app/budgets/_components/delete-dialog";
import IconEllipsis from "~/app/_assets/icon-ellipsis.svg";

interface ActionsMenuProps
  extends ComponentPropsWithRef<typeof DropdownMenu.Content> {
  budget: { id: string; category: { name: string } };
}

const ActionsMenu = ({ className, budget, ...props }: ActionsMenuProps) => {
  const router = useRouter();
  // todo: Might want to hoist dialog to page
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className="transition-colors hocus:text-grey-900">
          <span className="sr-only">Actions</span>
          <span className="grid size-200 place-items-center">
            <IconEllipsis />
          </span>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className={cx(
              className,
              "rounded-lg bg-white text-grey-900 shadow-[0_0.25rem_1.5rem_hsl(0_0%_0%/0.25)]",
            )}
            sideOffset={12}
            align="end"
            {...props}
          >
            <DropdownMenu.Item
              className="px-250 py-150"
              onSelect={() => {
                router.push(`/budgets/${budget.id}/edit`);
              }}
            >
              Edit Budget
            </DropdownMenu.Item>
            <div className="mx-250 border-t-[0.0625rem] border-grey-100" />
            <DropdownMenu.Item
              className="px-250 py-150 text-red"
              onSelect={() => {
                setIsDeleteDialogOpen(true);
              }}
            >
              Delete Budget
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      <DeleteDialog.Root
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <DeleteDialog.Portal budget={budget} />
      </DeleteDialog.Root>
    </>
  );
};

export default ActionsMenu;
