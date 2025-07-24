import * as Form from "~/app/_components/form";
import { notFound } from "next/navigation";
import * as Dialog from "~/app/_components/ui/dialog";
import * as FormUI from "~/app/_components/ui/form";
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
      </Dialog.Content>
    </DialogPage>
  );
};

export default AddMoneyToPotPage;
