import * as Dialog from "~/app/_components/ui/dialog";
import * as Form from "~/app/_components/form";
import * as DeleteDialog from "~/app/pots/_components/delete-dialog";
import { notFound } from "next/navigation";
import { db } from "~/server/db";
import ThemesCombobox from "~/app/_components/themes-combobox";
import Button from "~/app/_components/ui/button";
import EditPotForm from "~/app/pots/_components/edit-pot-form";
import DeletePotForm from "~/app/pots/_components/delete-pot-form";
import { Dehydrated, Hydrated } from "~/app/_components/hydration";
import CharactersLeft from "~/app/pots/_components/characters-left";
import { nbsp } from "~/app/_unicode";

const EditPotPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const [pot, themes] = await Promise.all([
    db.pot.findUnique({
      select: {
        id: true,
        name: true,
        target: true,
        theme: {
          select: {
            id: true,
          },
        },
      },
      where: {
        id,
      },
    }),
    db.theme.findMany({
      select: {
        id: true,
        name: true,
        color: true,
        Pot: {
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
  if (!pot) {
    notFound();
  }

  return (
    <Dialog.Content>
      <Dialog.Heading>Edit Pot</Dialog.Heading>
      <Dialog.Description>
        If your saving targets change, feel free to update your pots.
      </Dialog.Description>
      <EditPotForm
        defaultValue={{
          id: pot.id,
          name: pot.name,
          target: pot.target,
          theme: pot.theme.id,
        }}
      >
        <Form.HiddenField name="id" />
        <Dialog.Groups>
          <Dialog.Group>
            <Form.Label name="name">Pot Name</Form.Label>
            <Form.Textbox name="name" placeholder="e.g. Rainy Days" />
            <Form.Message name="name" />
            {/* todo: ARIA description */}
            <Dialog.Message>
              <Hydrated>
                <CharactersLeft name="name" /> characters left
              </Hydrated>
              <Dehydrated>{nbsp}</Dehydrated>
            </Dialog.Message>
          </Dialog.Group>
          <Dialog.Group>
            <Form.Label name="target">Target</Form.Label>
            <Form.Textbox name="target" placeholder="e.g. 2000" />
            <Form.Message name="target" />
          </Dialog.Group>
          <Dialog.Group>
            <Form.Label name="theme">Theme</Form.Label>
            <ThemesCombobox
              name="theme"
              themes={themes.map((t) => ({
                ...t,
                unavailable: t.Pot !== null && t.Pot.id !== pot.id,
              }))}
            />
            <Form.Message name="theme" />
          </Dialog.Group>
        </Dialog.Groups>
        <Button type="submit">Save Changes</Button>
      </EditPotForm>
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
