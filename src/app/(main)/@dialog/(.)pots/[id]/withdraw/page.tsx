import * as Dialog from "@radix-ui/react-dialog";
import RoutedDialog from "~/app/_components/routed-dialog";
import * as Form from "~/app/_components/form";
import * as DialogUI from "~/app/_components/ui/dialog";
import Button from "~/app/_components/ui/button";
import { notFound } from "next/navigation";
import WithdrawForm from "~/app/(main)/pots/_components/withdraw-form";
import WithdrawMeterSection from "~/app/(main)/pots/_components/withdraw-meter-section";
import Status from "~/app/_components/status";
import { Idle, Pending } from "~/app/_components/form-status";
import Spinner from "~/app/_components/ui/spinner";
import { getPot } from "~/server/pot";

const AddMoneyToPotPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
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
                        <h2>Withdraw from ‘{pot.name}’</h2>
                      </DialogUI.Heading>
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <DialogUI.Close />
                    </Dialog.Close>
                  </DialogUI.Header>
                  <Dialog.Description asChild>
                    <DialogUI.Description>
                      Withdraw from your pot to put money back in your main
                      balance. This will reduce the amount you have in this pot.
                    </DialogUI.Description>
                  </Dialog.Description>
                  <WithdrawForm defaultValue={{ id: pot.id }}>
                    <WithdrawMeterSection
                      name="amount"
                      total={pot.total}
                      target={pot.target}
                    />
                    <DialogUI.Groups>
                      <Form.HiddenField name="id" />
                      <DialogUI.Group>
                        <Form.Label name="amount">
                          Amount to Withdraw
                        </Form.Label>
                        <Form.Textbox name="amount" placeholder="e.g. 2000" />
                        <Form.Message name="amount" />
                      </DialogUI.Group>
                    </DialogUI.Groups>
                    <Status className="sr-only">
                      <Pending>Withdrawing money</Pending>
                    </Status>
                    <Button type="submit">
                      <Idle>Confirm Withdrawal</Idle>
                      <Pending>
                        <Spinner />
                        <span className="sr-only">Withdrawing Money</span>
                      </Pending>
                    </Button>
                  </WithdrawForm>
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
