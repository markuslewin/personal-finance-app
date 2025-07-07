import * as Dialog from "~/app/_components/ui/dialog";
import * as Form from "~/app/_components/form";
import AddBudgetForm from "~/app/(main)/budgets/add/_components/add-budget-form";
import CategoriesCombobox from "~/app/(main)/budgets/_components/categories-combobox";
import ThemesCombobox from "~/app/_components/themes-combobox";
import Button from "~/app/_components/ui/button";
import DialogPage from "~/app/_components/ui/dialog-page";
import Status from "~/app/_components/status";
import { Idle, Pending } from "~/app/_components/form-status";
import Spinner from "~/app/_components/ui/spinner";
import { getAvailableCategories } from "~/server/category";
import { getThemesWithBudget } from "~/server/theme";

const AddBudgetPage = async () => {
  const [categories, themes] = await Promise.all([
    getAvailableCategories(),
    getThemesWithBudget(),
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
    <DialogPage>
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
          <Status className="sr-only">
            <Pending>Adding budget</Pending>
          </Status>
          <Button type="submit">
            <Idle>Add Budget</Idle>
            <Pending>
              <Spinner />
              <span className="sr-only">Adding Budget</span>
            </Pending>
          </Button>
        </AddBudgetForm>
      </Dialog.Content>
    </DialogPage>
  );
};

export default AddBudgetPage;
