import { type Metadata } from "next";
import { notFound } from "next/navigation";
import DeleteBudgetForm from "~/app/(main)/budgets/[id]/edit/_components/delete-budget-form";
import EditBudgetForm from "~/app/(main)/budgets/[id]/edit/_components/edit-budget-form";
import CategoriesCombobox from "~/app/(main)/budgets/_components/categories-combobox";
import * as DeleteDialog from "~/app/(main)/budgets/_components/delete-dialog";
import { requireRealUser } from "~/app/_auth";
import { DollarTextbox } from "~/app/_components/dollar-textbox";
import * as Form from "~/app/_components/form";
import { Idle, Pending } from "~/app/_components/form-status";
import { Dehydrated, Hydrated } from "~/app/_components/hydration";
import Status from "~/app/_components/status";
import ThemesCombobox from "~/app/_components/themes-combobox";
import Button from "~/app/_components/ui/button";
import * as Dialog from "~/app/_components/ui/dialog";
import DialogPage from "~/app/_components/ui/dialog-page";
import * as FormUI from "~/app/_components/ui/form";
import Spinner from "~/app/_components/ui/spinner";
import { toDollarValue } from "~/app/_currency";
import { getBudget } from "~/server/budget";
import { getAvailableCategories } from "~/server/category";
import { getThemesWithBudget } from "~/server/theme";

export const metadata: Metadata = {
  title: "Edit budget",
};

const EditBudgetPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  await requireRealUser();

  const id = (await params).id;
  const budget = await getBudget(id);
  if (!budget) {
    notFound();
  }

  const [categories, themes] = await Promise.all([
    getAvailableCategories(budget.category.id),
    getThemesWithBudget(),
  ]);

  return (
    <DialogPage>
      <Dialog.Content>
        <Dialog.Heading>Edit Budget</Dialog.Heading>
        <Dialog.Description>
          As your budgets change, feel free to update your spending limits.
        </Dialog.Description>
        <EditBudgetForm
          budget={{
            id: budget.id,
            maximum: toDollarValue(budget.maximum),
            category: budget.category.id,
            theme: budget.theme.id,
          }}
        >
          <Form.HiddenField name="id" />
          <FormUI.Groups>
            <FormUI.Group>
              <Form.Label name="category">Budget Category</Form.Label>
              <CategoriesCombobox name="category" categories={categories} />
              <Form.Message name="category" />
            </FormUI.Group>
            <FormUI.Group>
              <Form.Label name="maximum">Maximum Spend</Form.Label>
              <DollarTextbox name="maximum" placeholder="e.g. 2000" />
              <Form.Message name="maximum" />
            </FormUI.Group>
            <FormUI.Group>
              <Form.Label name="theme">Theme</Form.Label>
              <ThemesCombobox
                name="theme"
                themes={themes.map((t) => ({
                  ...t,
                  unavailable: t.budget !== null && t.budget.id !== budget.id,
                }))}
              />
              <Form.Message name="theme" />
            </FormUI.Group>
          </FormUI.Groups>
          <Status className="sr-only">
            <Pending>Saving changes</Pending>
          </Status>
          <Button type="submit">
            <Idle>Save Changes</Idle>
            <Pending>
              <Spinner />
              <span className="sr-only">Saving Changes</span>
            </Pending>
          </Button>
        </EditBudgetForm>
        <Hydrated>
          <DeleteDialog.Root>
            <DeleteDialog.Trigger asChild>
              <Button type="submit" intent="destroy">
                Delete Budget
              </Button>
            </DeleteDialog.Trigger>
            <DeleteDialog.Portal budget={budget} />
          </DeleteDialog.Root>
        </Hydrated>
        <Dehydrated>
          <DeleteBudgetForm id={budget.id}>
            <Form.HiddenField name="id" />
            <Button type="submit" intent="destroy">
              Delete Budget
            </Button>
          </DeleteBudgetForm>
        </Dehydrated>
      </Dialog.Content>
    </DialogPage>
  );
};

export default EditBudgetPage;
