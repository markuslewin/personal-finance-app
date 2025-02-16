"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cx } from "class-variance-authority";
import { useRouter } from "next/navigation";
import { useState, type ComponentPropsWithRef } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Card from "~/app/budgets/_components/card";
import * as Form from "~/app/_components/form";
import IconEllipsis from "~/app/_assets/icon-ellipsis.svg";
import Button from "~/app/_components/button";
import { budgetIdSchema } from "~/app/budgets/_schemas";
import { remove } from "~/app/budgets/_actions";

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
      <AlertDialog.Root
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 grid grid-cols-[minmax(auto,35rem)] items-center justify-center overflow-y-auto bg-[hsl(0_0%_0%/0.5)] p-250">
            <AlertDialog.Content>
              <Card.Root asChild>
                <article>
                  <Card.Header>
                    <AlertDialog.Title asChild>
                      <Card.Heading asChild>
                        <h2>Delete ‘{budget.category.name}’?</h2>
                      </Card.Heading>
                    </AlertDialog.Title>
                    <AlertDialog.Cancel asChild>
                      <Card.Close />
                    </AlertDialog.Cancel>
                  </Card.Header>
                  <AlertDialog.Description asChild>
                    <Card.Description>
                      Are you sure you want to delete this budget? This action
                      cannot be reversed, and all the data inside it will be
                      removed forever.
                    </Card.Description>
                  </AlertDialog.Description>
                  <Form.Root
                    schema={budgetIdSchema}
                    action={remove}
                    defaultValue={{ id: budget.id }}
                  >
                    <Form.HiddenField name="id" />
                    <Button type="submit" intent="destroy">
                      Yes, Confirm Deletion
                    </Button>
                  </Form.Root>
                  <AlertDialog.Cancel asChild>
                    <Button intent="tertiary">No, Go Back</Button>
                  </AlertDialog.Cancel>
                </article>
              </Card.Root>
            </AlertDialog.Content>
          </AlertDialog.Overlay>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </>
  );
};

export default ActionsMenu;
