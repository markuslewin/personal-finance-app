import * as Form from "~/app/_components/form";
import { notFound } from "next/navigation";
import * as Dialog from "~/app/_components/ui/dialog";
import { db } from "~/server/db";
import Button from "~/app/_components/ui/button";
import { Hydrated } from "~/app/_components/hydration";
import AddMoneyForm from "~/app/pots/_components/add-money-form";

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
    },
    where: {
      id,
    },
  });
  if (!pot) {
    notFound();
  }

  return (
    <Dialog.Content>
      <Dialog.Heading>Add to ‘{pot.name}’</Dialog.Heading>
      <Dialog.Description>
        Add money to your pot to keep it separate from your main balance. As
        soon as you add this money, it will be deducted from your current
        balance.
      </Dialog.Description>
      <AddMoneyForm defaultValue={{ id: pot.id }}>
        <Hydrated>
          {/* todo: Meter */}
          <p />
        </Hydrated>
        <Dialog.Groups>
          <Form.HiddenField name="id" />
          <Dialog.Group>
            <Form.Label name="amount">Amount to Add</Form.Label>
            <Form.Textbox name="amount" placeholder="e.g. 2000" />
            <Form.Message name="amount" />
          </Dialog.Group>
        </Dialog.Groups>
        <Button type="submit">Confirm Addition</Button>
      </AddMoneyForm>
    </Dialog.Content>
  );
};

export default AddMoneyToPotPage;
