import * as Dialog from "@radix-ui/react-dialog";
import RoutedDialog from "~/app/_components/routed-dialog";
import * as Form from "~/app/_components/form";
import * as DialogUI from "~/app/_components/ui/dialog";
import Button from "~/app/_components/ui/button";
import { db } from "~/server/db";
import { notFound } from "next/navigation";
import AddMoneyForm from "~/app/(main)/pots/_components/add-money-form";
import MeterSection from "~/app/(main)/pots/_components/meter-section";

const AddMoneyToPotPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;
  const pot = await db.pot.findUnique({
    select: {
      id: true,
      name: true,
      total: true,
      target: true,
    },
    where: {
      id,
    },
  });
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
                    <DialogUI.Groups>
                      <Form.HiddenField name="id" />
                      <DialogUI.Group>
                        <Form.Label name="amount">Amount to Add</Form.Label>
                        <Form.Textbox name="amount" placeholder="e.g. 2000" />
                        <Form.Message name="amount" />
                      </DialogUI.Group>
                    </DialogUI.Groups>
                    <Button type="submit">Confirm Addition</Button>
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
