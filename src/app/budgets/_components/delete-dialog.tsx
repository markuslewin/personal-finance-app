import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Card from "~/app/budgets/_components/card";
import * as Form from "~/app/_components/form";
import { type ComponentPropsWithRef } from "react";
import DeleteBudgetForm from "~/app/budgets/[id]/edit/_components/delete-budget-form";
import Button from "~/app/_components/button";

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
                  cannot be reversed, and all the data inside it will be removed
                  forever.
                </Card.Description>
              </AlertDialog.Description>
              <DeleteBudgetForm id={budget.id}>
                <Form.HiddenField name="id" />
                <Button type="submit" intent="destroy">
                  Yes, Confirm Deletion
                </Button>
              </DeleteBudgetForm>
              <AlertDialog.Cancel asChild>
                <Button intent="tertiary">No, Go Back</Button>
              </AlertDialog.Cancel>
            </article>
          </Card.Root>
        </AlertDialog.Content>
      </AlertDialog.Overlay>
    </AlertDialog.Portal>
  );
};
