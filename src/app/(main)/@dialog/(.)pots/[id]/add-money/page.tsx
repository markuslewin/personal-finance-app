import * as Dialog from "@radix-ui/react-dialog";
import RoutedDialog from "~/app/_components/routed-dialog";
import * as Form from "~/app/_components/form";
import * as DialogUI from "~/app/_components/ui/dialog";
import * as FormUI from "~/app/_components/ui/form";
import Button from "~/app/_components/ui/button";
import { notFound } from "next/navigation";
import AddMoneyForm from "~/app/(main)/pots/_components/add-money-form";
import MeterSection from "~/app/(main)/pots/_components/meter-section";
import Status from "~/app/_components/status";
import { Idle, Pending } from "~/app/_components/form-status";
import Spinner from "~/app/_components/ui/spinner";
import { getPot } from "~/server/pot";
import { requireRealUser } from "~/app/_auth";
import { DollarTextbox } from "~/app/_components/dollar-textbox";

const AddMoneyToPotPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  await requireRealUser();

  const id = (await params).id;
  const pot = await getPot(id);
  if (!pot) {
    notFound();
  }

  return (
    <RoutedDialog>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <DialogUI.Overlay>
            <Dialog.Content asChild>
              <DialogUI.Content asChild>
                <article>
                  <DialogUI.Header>
                    <Dialog.Title asChild>
                      <DialogUI.Heading asChild>
                        <h2>Add to ‘{pot.name}’</h2>
                      </DialogUI.Heading>
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <DialogUI.Close />
                    </Dialog.Close>
                  </DialogUI.Header>
                  <Dialog.Description asChild>
                    <DialogUI.Description>
                      Add money to your pot to keep it separate from your main
                      balance. As soon as you add this money, it will be
                      deducted from your current balance.
                    </DialogUI.Description>
                  </Dialog.Description>
                  <AddMoneyForm defaultValue={{ id: pot.id }}>
                    <MeterSection
                      name="amount"
                      total={pot.total}
                      target={pot.target}
                    />
                    <FormUI.Groups>
                      <Form.HiddenField name="id" />
                      <FormUI.Group>
                        <Form.Label name="amount">Amount to Add</Form.Label>
                        <DollarTextbox name="amount" placeholder="e.g. 2000" />
                        <Form.Message name="amount" />
                      </FormUI.Group>
                    </FormUI.Groups>
                    <Status className="sr-only">
                      <Pending>Adding money</Pending>
                    </Status>
                    <Button type="submit">
                      <Idle>Confirm Addition</Idle>
                      <Pending>
                        <Spinner />
                        <span className="sr-only">Adding Money</span>
                      </Pending>
                    </Button>
                  </AddMoneyForm>
                </article>
              </DialogUI.Content>
            </Dialog.Content>
          </DialogUI.Overlay>
        </Dialog.Overlay>
      </Dialog.Portal>
    </RoutedDialog>
  );
};

export default AddMoneyToPotPage;
