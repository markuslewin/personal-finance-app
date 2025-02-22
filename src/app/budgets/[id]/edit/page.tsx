import * as Dialog from "~/app/_components/ui/dialog";
import * as Form from "~/app/_components/form";
import * as DeleteDialog from "~/app/budgets/_components/delete-dialog";
import { notFound } from "next/navigation";
import { db } from "~/server/db";
import CategoriesCombobox from "~/app/budgets/_components/categories-combobox";
import ThemesCombobox from "~/app/_components/themes-combobox";
import Button from "~/app/_components/ui/button";
import EditBudgetForm from "~/app/budgets/[id]/edit/_components/edit-budget-form";
import DeleteBudgetForm from "~/app/budgets/[id]/edit/_components/delete-budget-form";
import { Dehydrated, Hydrated } from "~/app/_components/hydration";

const EditBudgetPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;
  const budget = await db.budget.findUnique({
    select: {
      id: true,
      maximum: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      theme: {
        select: {
          id: true,
        },
      },
    },
    where: {
      id,
    },
  });
  if (!budget) {
    notFound();
  }

  return (
    <Dialog.Content>
      <Dialog.Heading>Edit Budget</Dialog.Heading>
      <Dialog.Description>
        As your budgets change, feel free to update your spending limits.
      </Dialog.Description>
      <EditBudgetForm
        budget={{
          id: budget.id,
          maximum: budget.maximum,
          category: budget.category.id,
          theme: budget.theme.id,
        }}
      >
        <Form.HiddenField name="id" />
        <Dialog.Groups>
          <Dialog.Group>
            <Form.Label name="category">Budget Category</Form.Label>
            <CategoriesCombobox name="category" />
            <Form.Message name="category" />
          </Dialog.Group>
          <Dialog.Group>
            <Form.Label name="maximum">Maximum Spend</Form.Label>
            <Form.Textbox name="maximum" placeholder="e.g. 2000" />
            <Form.Message name="maximum" />
          </Dialog.Group>
          <Dialog.Group>
            <Form.Label name="theme">Theme</Form.Label>
            <ThemesCombobox name="theme" />
            <Form.Message name="theme" />
          </Dialog.Group>
        </Dialog.Groups>
        <Button type="submit">Save Changes</Button>
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
  );
};

export default EditBudgetPage;
