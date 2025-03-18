import * as Dialog from "@radix-ui/react-dialog";
import RoutedDialog from "~/app/_components/routed-dialog";
import * as Form from "~/app/_components/form";
import * as DialogUI from "~/app/_components/ui/dialog";
import Button from "~/app/_components/ui/button";
import CategoriesCombobox from "~/app/budgets/_components/categories-combobox";
import ThemesCombobox from "~/app/_components/themes-combobox";
import AddBudgetForm from "~/app/budgets/add/_components/add-budget-form";
import { db } from "~/server/db";

const AddBudgetPage = async () => {
  const themes = await db.theme.findMany({
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
  });
  const suggestedTheme = themes.find((t) => t.Budget === null);
  if (suggestedTheme === undefined) {
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
                  <AddBudgetForm suggestedThemeId={suggestedTheme.id}>
                    <DialogUI.Groups>
                      <DialogUI.Group>
                        <Form.Label name="category">Budget Category</Form.Label>
                        <CategoriesCombobox name="category" />
                        <Form.Message name="category" />
                      </DialogUI.Group>
                      <DialogUI.Group>
                        <Form.Label name="maximum">Maximum Spend</Form.Label>
                        <Form.Textbox name="maximum" placeholder="e.g. 2000" />
                        <Form.Message name="maximum" />
                      </DialogUI.Group>
                      <DialogUI.Group>
                        <Form.Label name="theme">Theme</Form.Label>
                        <ThemesCombobox
                          name="theme"
                          themes={themes.map((t) => ({
                            ...t,
                            unavailable: t.Budget !== null,
                          }))}
                        />
                        <Form.Message name="theme" />
                      </DialogUI.Group>
                    </DialogUI.Groups>
                    <Button type="submit">Add Budget</Button>
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
