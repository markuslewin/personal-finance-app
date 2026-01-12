import { notFound } from "next/navigation";
import { Dialog } from "radix-ui";
import EditBudgetForm from "~/app/(main)/budgets/[id]/edit/_components/edit-budget-form";
import CategoriesCombobox from "~/app/(main)/budgets/_components/categories-combobox";
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
import { toDollarValue } from "~/app/_currency";
import { getBudget } from "~/server/budget";
import { getAvailableCategories } from "~/server/category";
import { getThemesWithBudget } from "~/server/theme";

const EditBudgetPage = async ({ params }: PageProps<"/budgets/[id]/edit">) => {
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
                        <h2>Edit Budget</h2>
                      </DialogUI.Heading>
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <DialogUI.Close />
                    </Dialog.Close>
                  </DialogUI.Header>
                  <Dialog.Description asChild>
                    <DialogUI.Description>
                      As your budgets change, feel free to update your spending
                      limits.
                    </DialogUI.Description>
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
                            unavailable:
                              t.budget !== null && t.budget.id !== budget.id,
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
                </article>
              </DialogUI.Content>
            </Dialog.Content>
          </DialogUI.Overlay>
        </Dialog.Overlay>
      </Dialog.Portal>
    </RoutedDialog>
  );
};

export default EditBudgetPage;
