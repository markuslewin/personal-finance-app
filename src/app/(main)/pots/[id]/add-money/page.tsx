import * as Form from "~/app/_components/form";
import { notFound } from "next/navigation";
import * as Dialog from "~/app/_components/ui/dialog";
import Button from "~/app/_components/ui/button";
import { Dehydrated, Hydrated } from "~/app/_components/hydration";
import AddMoneyForm from "~/app/(main)/pots/_components/add-money-form";
import MeterSection from "~/app/(main)/pots/_components/meter-section";
import { nbsp } from "~/app/_unicode";
import DialogPage from "~/app/_components/ui/dialog-page";
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
    <DialogPage>
      <Dialog.Content>
        <Dialog.Heading>Add to ‘{pot.name}’</Dialog.Heading>
        <Dialog.Description>
          Add money to your pot to keep it separate from your main balance. As
          soon as you add this money, it will be deducted from your current
          balance.
        </Dialog.Description>
        <AddMoneyForm defaultValue={{ id: pot.id }}>
          <Hydrated>
            <MeterSection name="amount" total={pot.total} target={pot.target} />
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
              <Form.Label name="amount">Amount to Add</Form.Label>
              <Form.Textbox name="amount" placeholder="e.g. 2000" />
              <Form.Message name="amount" />
            </Dialog.Group>
          </Dialog.Groups>
          <Button type="submit">
            <Status>
              <Idle>Confirm Addition</Idle>
              <Pending>
                <Spinner />
                <span className="sr-only">Adding Money</span>
              </Pending>
            </Status>
          </Button>
        </AddMoneyForm>
      </Dialog.Content>
    </DialogPage>
  );
};

export default AddMoneyToPotPage;
