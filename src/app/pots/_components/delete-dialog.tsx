import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Dialog from "~/app/_components/ui/dialog";
import * as Form from "~/app/_components/form";
import { type ComponentPropsWithRef } from "react";
import DeleteBudgetForm from "~/app/budgets/[id]/edit/_components/delete-budget-form";
import Button from "~/app/_components/ui/button";

type RootProps = ComponentPropsWithRef<typeof AlertDialog.Root>;

export const Root = (props: RootProps) => {
  return <AlertDialog.Root {...props} />;
};

type TriggerProps = ComponentPropsWithRef<typeof AlertDialog.Trigger>;

export const Trigger = (props: TriggerProps) => {
  return <AlertDialog.Trigger {...props} />;
};

type PortalProps = ComponentPropsWithRef<typeof AlertDialog.Portal> & {
  pot: {
    id: string;
    name: string;
  };
};

export const Portal = ({ pot, ...props }: PortalProps) => {
  return (
    <AlertDialog.Portal {...props}>
      <AlertDialog.Overlay asChild>
        <Dialog.Overlay>
          {/* todo: Should have `asChild`, but throws */}
          <AlertDialog.Content>
            <Dialog.Content asChild>
              <article>
                <Dialog.Header>
                  <AlertDialog.Title asChild>
                    <Dialog.Heading asChild>
                      <h2>Delete ‘{pot.name}’?</h2>
                    </Dialog.Heading>
                  </AlertDialog.Title>
                  <AlertDialog.Cancel asChild>
                    <Dialog.Close />
                  </AlertDialog.Cancel>
                </Dialog.Header>
                <AlertDialog.Description asChild>
                  <Dialog.Description>
                    Are you sure you want to delete this pot? This action cannot
                    be reversed, and all the data inside it will be removed
                    forever.
                  </Dialog.Description>
                </AlertDialog.Description>
                {/* todo: DeletePotForm */}
                {/* <DeleteBudgetForm id={budget.id}>
                  <Form.HiddenField name="id" />
                  <Button type="submit" intent="destroy">
                    Yes, Confirm Deletion
                  </Button>
                </DeleteBudgetForm> */}
                <AlertDialog.Cancel asChild>
                  <Button intent="tertiary">No, Go Back</Button>
                </AlertDialog.Cancel>
              </article>
              <p>blabla</p>
            </Dialog.Content>
          </AlertDialog.Content>
        </Dialog.Overlay>
      </AlertDialog.Overlay>
    </AlertDialog.Portal>
  );
};
