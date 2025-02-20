import * as Form from "~/app/_components/form";
import { notFound } from "next/navigation";
import * as Dialog from "~/app/_components/ui/dialog";
import { db } from "~/server/db";
import Button from "~/app/_components/ui/button";
import { Dehydrated, Hydrated } from "~/app/_components/hydration";
import { nbsp } from "~/app/_unicode";
import WithdrawForm from "~/app/pots/_components/withdraw-form";
import WithdrawMeterSection from "~/app/pots/_components/withdraw-meter-section";

const WithdrawFromPotPage = async ({
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
    <Dialog.Content>
      <Dialog.Heading>Withdraw from ‘{pot.name}’</Dialog.Heading>
      <Dialog.Description>
        Withdraw from your pot to put money back in your main balance. This will
        reduce the amount you have in this pot.
      </Dialog.Description>
      <WithdrawForm defaultValue={{ id: pot.id }}>
        <Hydrated>
          <WithdrawMeterSection
            name="amount"
            total={pot.total}
            target={pot.target}
          />
        </Hydrated>
        <Dehydrated>
          {/* Skeleton avoids layout shift */}
          <div>
            <div className="text-preset-1">{nbsp}</div>
            <div className="mt-[2.25rem] text-preset-5-bold">{nbsp}</div>
          </div>
        </Dehydrated>
        <Dialog.Groups>
          <Form.HiddenField name="id" />
          <Dialog.Group>
            <Form.Label name="amount">Amount to Withdraw</Form.Label>
            <Form.Textbox name="amount" placeholder="e.g. 2000" />
            <Form.Message name="amount" />
          </Dialog.Group>
        </Dialog.Groups>
        <Button type="submit">Confirm Withdrawal</Button>
      </WithdrawForm>
    </Dialog.Content>
  );
};

export default WithdrawFromPotPage;
