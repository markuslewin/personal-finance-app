import * as Card from "~/app/budgets/_components/card";
import * as Form from "~/app/_components/form";
import { notFound } from "next/navigation";
import { db } from "~/server/db";
import CategoriesCombobox from "~/app/budgets/_components/categories-combobox";
import ThemesCombobox from "~/app/budgets/_components/themes-combobox";
import EditBudgetForm from "~/app/budgets/[id]/edit/_components/edit-budget-form";
import Button from "~/app/_components/button";

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
    <Card.Root>
      <Card.Heading>Edit Budget</Card.Heading>
      <Card.Description>
        As your budgets change, feel free to update your spending limits.
      </Card.Description>
      <EditBudgetForm
        budget={{
          id: budget.id,
          maximum: budget.maximum,
          category: budget.category.id,
          theme: budget.theme.id,
        }}
      >
        <Form.HiddenField name="id" />
        <Card.Groups>
          <Card.Group>
            <Form.Label name="category">Budget Category</Form.Label>
            <CategoriesCombobox name="category" />
            <Form.Message name="category" />
          </Card.Group>
          <Card.Group>
            <Form.Label name="maximum">Maximum Spend</Form.Label>
            <Form.Textbox name="maximum" placeholder="e.g. 2000" />
            <Form.Message name="maximum" />
          </Card.Group>
          <Card.Group>
            <Form.Label name="theme">Theme</Form.Label>
            <ThemesCombobox name="theme" />
            <Form.Message name="theme" />
          </Card.Group>
        </Card.Groups>
        <Button type="submit">Save Changes</Button>
      </EditBudgetForm>
    </Card.Root>
  );
};

export default EditBudgetPage;
