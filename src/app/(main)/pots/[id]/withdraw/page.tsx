import * as Form from "~/app/_components/form";
import { notFound } from "next/navigation";
import * as Dialog from "~/app/_components/ui/dialog";
import * as FormUI from "~/app/_components/ui/form";
import Button from "~/app/_components/ui/button";
import { Dehydrated, Hydrated } from "~/app/_components/hydration";
import { nbsp } from "~/app/_unicode";
import WithdrawForm from "~/app/(main)/pots/_components/withdraw-form";
import WithdrawMeterSection from "~/app/(main)/pots/_components/withdraw-meter-section";
import DialogPage from "~/app/_components/ui/dialog-page";
import Status from "~/app/_components/status";
import { Idle, Pending } from "~/app/_components/form-status";
import Spinner from "~/app/_components/ui/spinner";
import { getPot } from "~/server/pot";
import { requireRealUser } from "~/app/_auth";
import { DollarTextbox } from "~/app/_components/dollar-textbox";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Withdraw money",
};

const WithdrawFromPotPage = async ({
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
        <Dialog.Heading>Withdraw from ‘{pot.name}’</Dialog.Heading>
        <Dialog.Description>
          Withdraw from your pot to put money back in your main balance. This
          will reduce the amount you have in this pot.
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
          <FormUI.Groups>
            <Form.HiddenField name="id" />
            <FormUI.Group>
              <Form.Label name="amount">Amount to Withdraw</Form.Label>
              <DollarTextbox name="amount" placeholder="e.g. 2000" />
              <Form.Message name="amount" />
            </FormUI.Group>
          </FormUI.Groups>
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
      </Dialog.Content>
    </DialogPage>
  );
};

export default WithdrawFromPotPage;
