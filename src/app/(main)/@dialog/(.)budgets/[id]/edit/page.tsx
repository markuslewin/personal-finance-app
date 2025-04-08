import * as Dialog from "@radix-ui/react-dialog";
import RoutedDialog from "~/app/_components/routed-dialog";
import * as Form from "~/app/_components/form";
import * as DialogUI from "~/app/_components/ui/dialog";
import Button from "~/app/_components/ui/button";
import CategoriesCombobox from "~/app/(main)/budgets/_components/categories-combobox";
import ThemesCombobox from "~/app/_components/themes-combobox";
import { db } from "~/server/db";
import { notFound } from "next/navigation";
import EditBudgetForm from "~/app/(main)/budgets/[id]/edit/_components/edit-budget-form";
import Status from "~/app/_components/status";
import { Idle, Pending } from "~/app/_components/form-status";
import Spinner from "~/app/_components/ui/spinner";
import { getBudget } from "~/server/budget";

const EditBudgetPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;
  const budget = await getBudget(id);
  if (!budget) {
    notFound();
  }

  const [categories, themes] = await Promise.all([
    db.category.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        OR: [
          { Budget: { is: null } },
          {
            Budget: {
              categoryId: budget.category.id,
            },
          },
        ],
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
                      maximum: budget.maximum,
                      category: budget.category.id,
                      theme: budget.theme.id,
                    }}
                  >
                    <Form.HiddenField name="id" />
                    <DialogUI.Groups>
                      <DialogUI.Group>
                        <Form.Label name="category">Budget Category</Form.Label>
                        <CategoriesCombobox
                          name="category"
                          categories={categories}
                        />
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
                            unavailable:
                              t.Budget !== null && t.Budget.id !== budget.id,
                          }))}
                        />
                        <Form.Message name="theme" />
                      </DialogUI.Group>
                    </DialogUI.Groups>
                    <Button type="submit">
                      <Status>
                        <Idle>Save Changes</Idle>
                        <Pending>
                          <Spinner />
                          <span className="sr-only">Saving Changes</span>
                        </Pending>
                      </Status>
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
