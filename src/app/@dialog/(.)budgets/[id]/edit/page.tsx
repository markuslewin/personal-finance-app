import * as Dialog from "@radix-ui/react-dialog";
import RoutedDialog from "~/app/_components/routed-dialog";
import IconCloseModal from "~/app/_assets/icon-close-modal.svg";
import * as Form from "~/app/_components/form";
import * as Card from "~/app/budgets/_components/card";
import Button from "~/app/_components/button";
import CategoriesCombobox from "~/app/budgets/_components/categories-combobox";
import ThemesCombobox from "~/app/budgets/_components/themes-combobox";
import { db } from "~/server/db";
import { notFound } from "next/navigation";
import EditBudgetForm from "~/app/budgets/[id]/edit/_components/edit-budget-form";

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
    <RoutedDialog>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 grid grid-cols-[minmax(auto,35rem)] items-center justify-center overflow-y-auto bg-[hsl(0_0%_0%/0.5)] p-250">
          <Dialog.Content asChild>
            <Card.Root asChild>
              <article>
                <Card.Header>
                  <Dialog.Title asChild>
                    <Card.Heading asChild>
                      <h2>Edit Budget</h2>
                    </Card.Heading>
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <Card.Close />
                  </Dialog.Close>
                </Card.Header>
                <Dialog.Description asChild>
                  <Card.Description>
                    As your budgets change, feel free to update your spending
                    limits.
                  </Card.Description>
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
              </article>
            </Card.Root>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </RoutedDialog>
  );
};

export default EditBudgetPage;
