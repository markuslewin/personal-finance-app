import { ErrorPage } from "~/app/(main)/_components/error-page";
import CategoriesCombobox from "~/app/(main)/budgets/_components/categories-combobox";
import AddBudgetForm from "~/app/(main)/budgets/add/_components/add-budget-form";
import { requireRealUser } from "~/app/_auth";
import { DollarTextbox } from "~/app/_components/dollar-textbox";
import * as Form from "~/app/_components/form";
import { Idle, Pending } from "~/app/_components/form-status";
import Status from "~/app/_components/status";
import ThemesCombobox from "~/app/_components/themes-combobox";
import Button from "~/app/_components/ui/button";
import * as Dialog from "~/app/_components/ui/dialog";
import DialogPage from "~/app/_components/ui/dialog-page";
import * as FormUI from "~/app/_components/ui/form";
import Spinner from "~/app/_components/ui/spinner";
import { getAvailableCategories } from "~/server/category";
import { getThemesWithBudget } from "~/server/theme";

const AddBudgetPage = async () => {
  await requireRealUser();

  const [categories, themes] = await Promise.all([
    getAvailableCategories(),
    getThemesWithBudget(),
  ]);

  const defaultCategory = categories[0];
  if (defaultCategory === undefined) {
    return <ErrorPage message="No categories left." />;
  }

  const defaultTheme = themes.find((t) => t.budget === null);
  if (defaultTheme === undefined) {
    return <ErrorPage message="No themes left." />;
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
                  unavailable: t.budget !== null,
                }))}
              />
              <Form.Message name="theme" />
            </FormUI.Group>
          </FormUI.Groups>
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
