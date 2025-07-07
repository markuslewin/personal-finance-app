import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Dialog from "~/app/_components/ui/dialog";
import * as Form from "~/app/_components/form";
import { type ComponentPropsWithRef } from "react";
import DeleteBudgetForm from "~/app/(main)/budgets/[id]/edit/_components/delete-budget-form";
import Button from "~/app/_components/ui/button";
import Status from "~/app/_components/status";
import { Idle, Pending } from "~/app/_components/form-status";
import Spinner from "~/app/_components/ui/spinner";

type RootProps = ComponentPropsWithRef<typeof AlertDialog.Root>;

export const Root = (props: RootProps) => {
  return <AlertDialog.Root {...props} />;
};

type TriggerProps = ComponentPropsWithRef<typeof AlertDialog.Trigger>;

export const Trigger = (props: TriggerProps) => {
  return <AlertDialog.Trigger {...props} />;
};

type PortalProps = ComponentPropsWithRef<typeof AlertDialog.Portal> & {
  budget: {
    id: string;
    category: {
      name: string;
    };
  };
};

export const Portal = ({ budget, ...props }: PortalProps) => {
  return (
    <AlertDialog.Portal {...props}>
      <AlertDialog.Overlay asChild>
        <Dialog.Overlay>
          <Dialog.Content asChild>
            <AlertDialog.Content asChild>
              <article>
                <Dialog.Header>
                  <AlertDialog.Title asChild>
                    <Dialog.Heading asChild>
                      <h2>Delete ‘{budget.category.name}’?</h2>
                    </Dialog.Heading>
                  </AlertDialog.Title>
                  <AlertDialog.Cancel asChild>
                    <Dialog.Close />
                  </AlertDialog.Cancel>
                </Dialog.Header>
                <AlertDialog.Description asChild>
                  <Dialog.Description>
                    Are you sure you want to delete this budget? This action
                    cannot be reversed, and all the data inside it will be
                    removed forever.
                  </Dialog.Description>
                </AlertDialog.Description>
                <DeleteBudgetForm id={budget.id}>
                  <Form.HiddenField name="id" />
                  <Status className="sr-only">
                    <Pending>Deleting budget</Pending>
                  </Status>
                  <Button type="submit" intent="destroy">
                    <Idle>Yes, Confirm Deletion</Idle>
                    <Pending>
                      <Spinner />
                      <span className="sr-only">Deleting Budget</span>
                    </Pending>
                  </Button>
                </DeleteBudgetForm>
                <AlertDialog.Cancel asChild>
                  <Button intent="tertiary">No, Go Back</Button>
                </AlertDialog.Cancel>
              </article>
            </AlertDialog.Content>
          </Dialog.Content>
        </Dialog.Overlay>
      </AlertDialog.Overlay>
    </AlertDialog.Portal>
  );
};
