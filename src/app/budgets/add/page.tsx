import * as Dialog from "~/app/_components/ui/dialog";
import * as Form from "~/app/_components/form";
import AddBudgetForm from "~/app/budgets/add/_components/add-budget-form";
import CategoriesCombobox from "~/app/budgets/_components/categories-combobox";
import ThemesCombobox from "~/app/_components/themes-combobox";
import Button from "~/app/_components/ui/button";
import { db } from "~/server/db";

const AddBudgetPage = async () => {
  const [categories, themes] = await Promise.all([
    db.category.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        Budget: {
          is: null,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    }),
    db.theme.findMany({
      select: {
        id: true,
        name: true,
        color: true,
        Budget: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    }),
  ]);

  // todo: Disable "Add New Budget"
  const defaultCategory = categories[0];
  if (defaultCategory === undefined) {
    throw new Error("No categories without budget left.");
  }

  const defaultTheme = themes.find((t) => t.Budget === null);
  if (defaultTheme === undefined) {
    throw new Error("No available theme left for budget.");
  }

  return (
    <Dialog.Content>
      <Dialog.Heading>Add New Budget</Dialog.Heading>
      <Dialog.Description>
        Choose a category to set a spending budget. These categories can help
        you monitor spending.
      </Dialog.Description>
      <AddBudgetForm
        defaultValue={{
          category: defaultCategory.id,
          theme: defaultTheme.id,
        }}
      >
        <Dialog.Groups>
          <Dialog.Group>
            <Form.Label name="category">Budget Category</Form.Label>
            <CategoriesCombobox name="category" categories={categories} />
            <Form.Message name="category" />
          </Dialog.Group>
          <Dialog.Group>
            <Form.Label name="maximum">Maximum Spend</Form.Label>
            <Form.Textbox name="maximum" placeholder="e.g. 2000" />
            <Form.Message name="maximum" />
          </Dialog.Group>
          <Dialog.Group>
            <Form.Label name="theme">Theme</Form.Label>
            <ThemesCombobox
              name="theme"
              themes={themes.map((t) => ({
                ...t,
                unavailable: t.Budget !== null,
              }))}
            />
            <Form.Message name="theme" />
          </Dialog.Group>
        </Dialog.Groups>
        <Button type="submit">Add Budget</Button>
      </AddBudgetForm>
    </Dialog.Content>
  );
};

export default AddBudgetPage;
