import * as Dialog from "~/app/_components/ui/dialog";
import * as Form from "~/app/_components/form";
import * as DeleteDialog from "~/app/pots/_components/delete-dialog";
import { notFound } from "next/navigation";
import { db } from "~/server/db";
// import ThemesCombobox from "~/app/pots/_components/themes-combobox";
import Button from "~/app/_components/ui/button";
// import EditBudgetForm from "~/app/pots/[id]/edit/_components/edit-budget-form";
import DeletePotForm from "~/app/pots/_components/delete-pot-form";
import { Dehydrated, Hydrated } from "~/app/_components/hydration";

const EditPotPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const pot = await db.pot.findUnique({
    select: {
      id: true,
      name: true,
    },
    where: {
      id,
    },
  });
  if (!pot) {
    notFound();
  }

  return (
    <Dialog.Content>
      <Dialog.Heading>Edit Pot</Dialog.Heading>
      <Dialog.Description>
        If your saving targets change, feel free to update your pots.
      </Dialog.Description>
      {/* <EditBudgetForm
        budget={{
          id: pot.id,
          maximum: pot.maximum,
          category: pot.category.id,
          theme: pot.theme.id,
        }}
      >
        <Form.HiddenField name="id" />
        <Dialog.Groups>
          <Dialog.Group>
            <Form.Label name="category">Budget Category</Form.Label>
            <CategoriesCombobox name="category" />
            <Form.Message name="category" />
          </Dialog.Group>
          <Dialog.Group>
            <Form.Label name="maximum">Maximum Spend</Form.Label>
            <Form.Textbox name="maximum" placeholder="e.g. 2000" />
            <Form.Message name="maximum" />
          </Dialog.Group>
          <Dialog.Group>
            <Form.Label name="theme">Theme</Form.Label>
            <ThemesCombobox name="theme" />
            <Form.Message name="theme" />
          </Dialog.Group>
        </Dialog.Groups>
        <Button type="submit">Save Changes</Button>
      </EditBudgetForm> */}
      <Hydrated>
        <DeleteDialog.Root>
          <DeleteDialog.Trigger asChild>
            <Button type="submit" intent="destroy">
              Delete Pot
            </Button>
          </DeleteDialog.Trigger>
          <DeleteDialog.Portal pot={pot} />
        </DeleteDialog.Root>
      </Hydrated>
      <Dehydrated>
        <DeletePotForm id={pot.id}>
          <Form.HiddenField name="id" />
          <Button type="submit" intent="destroy">
            Delete Pot
          </Button>
        </DeletePotForm>
      </Dehydrated>
    </Dialog.Content>
  );
};

export default EditPotPage;
