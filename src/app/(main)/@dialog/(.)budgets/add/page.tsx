import * as Dialog from "@radix-ui/react-dialog";
import RoutedDialog from "~/app/_components/routed-dialog";
import * as Form from "~/app/_components/form";
import * as DialogUI from "~/app/_components/ui/dialog";
import * as FormUI from "~/app/_components/ui/form";
import Button from "~/app/_components/ui/button";
import CategoriesCombobox from "~/app/(main)/budgets/_components/categories-combobox";
import ThemesCombobox from "~/app/_components/themes-combobox";
import AddBudgetForm from "~/app/(main)/budgets/add/_components/add-budget-form";
import Status from "~/app/_components/status";
import { Idle, Pending } from "~/app/_components/form-status";
import Spinner from "~/app/_components/ui/spinner";
import { getAvailableCategories } from "~/server/category";
import { getThemesWithBudget } from "~/server/theme";
import { requireRealUser } from "~/app/_auth";
import { DollarTextbox } from "~/app/_components/dollar-textbox";

const AddBudgetPage = async () => {
  await requireRealUser();

  const [categories, themes] = await Promise.all([
    getAvailableCategories(),
    getThemesWithBudget(),
  ]);

  // todo: Disable "Add New Budget"
  const defaultCategory = categories[0];
  if (defaultCategory === undefined) {
    throw new Error("No categories without budget left.");
  }

  const defaultTheme = themes.find((t) => t.budget === null);
  if (defaultTheme === undefined) {
    throw new Error("No available theme left for budget.");
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
