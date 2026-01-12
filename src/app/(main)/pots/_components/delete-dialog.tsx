import { AlertDialog } from "radix-ui";
import { type ComponentPropsWithRef } from "react";
import DeletePotForm from "~/app/(main)/pots/_components/delete-pot-form";
import * as Form from "~/app/_components/form";
import { Idle, Pending } from "~/app/_components/form-status";
import Status from "~/app/_components/status";
import Button from "~/app/_components/ui/button";
import * as Dialog from "~/app/_components/ui/dialog";
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
          <Dialog.Content asChild>
            <AlertDialog.Content asChild>
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
                <DeletePotForm id={pot.id}>
                  <Form.HiddenField name="id" />
                  <Status className="sr-only">
                    <Pending>Deleting pot</Pending>
                  </Status>
                  <Button type="submit" intent="destroy">
                    <Idle>Yes, Confirm Deletion</Idle>
                    <Pending>
                      <Spinner />
                      <span className="sr-only">Deleting Pot</span>
                    </Pending>
                  </Button>
                </DeletePotForm>
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
