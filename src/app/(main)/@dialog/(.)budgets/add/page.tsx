import { Dialog } from "radix-ui";
import { ErrorDialog } from "~/app/(main)/@dialog/_components/error-dialog";
import CategoriesCombobox from "~/app/(main)/budgets/_components/categories-combobox";
import AddBudgetForm from "~/app/(main)/budgets/add/_components/add-budget-form";
import { requireRealUser } from "~/app/_auth";
import { DollarTextbox } from "~/app/_components/dollar-textbox";
import * as Form from "~/app/_components/form";
import { Idle, Pending } from "~/app/_components/form-status";
import RoutedDialog from "~/app/_components/routed-dialog";
import Status from "~/app/_components/status";
import ThemesCombobox from "~/app/_components/themes-combobox";
import Button from "~/app/_components/ui/button";
import * as DialogUI from "~/app/_components/ui/dialog";
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
    return <ErrorDialog message="No categories left." />;
  }

  const defaultTheme = themes.find((t) => t.budget === null);
  if (defaultTheme === undefined) {
    return <ErrorDialog message="No themes left." />;
  }

  return (
    <RoutedDialog>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <DialogUI.Overlay>
            <Dialog.Content asChild>
              <DialogUI.Content asChild>
                <article>
                  <DialogUI.Header>
                    <Dialog.Title asChild>
                      <DialogUI.Heading asChild>
                        <h2>Add New Budget</h2>
                      </DialogUI.Heading>
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <DialogUI.Close />
                    </Dialog.Close>
                  </DialogUI.Header>
                  <Dialog.Description asChild>
                    <DialogUI.Description>
                      Choose a category to set a spending budget. These
                      categories can help you monitor spending.
                    </DialogUI.Description>
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
                        <CategoriesCombobox
                          name="category"
                          categories={categories}
                        />
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
                </article>
              </DialogUI.Content>
            </Dialog.Content>
          </DialogUI.Overlay>
        </Dialog.Overlay>
      </Dialog.Portal>
    </RoutedDialog>
  );
};

export default AddBudgetPage;
