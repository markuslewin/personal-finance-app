import * as Dialog from "~/app/_components/ui/dialog";
import * as Form from "~/app/_components/form";
import ThemesCombobox from "~/app/_components/themes-combobox";
import Button from "~/app/_components/ui/button";
import { Dehydrated, Hydrated } from "~/app/_components/hydration";
import AddPotForm from "~/app/(main)/pots/_components/add-pot-form";
import CharactersLeft from "~/app/(main)/pots/_components/characters-left";
import { nbsp } from "~/app/_unicode";
import { db } from "~/server/db";
import DialogPage from "~/app/_components/ui/dialog-page";

const AddPotPage = async () => {
  const themes = await db.theme.findMany({
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
  });

  // todo: Disable "Add New Pot"
  const defaultTheme = themes.find((t) => t.Pot === null);
  if (defaultTheme === undefined) {
    throw new Error("No available theme left for budget.");
  }

  return (
    <DialogPage>
      <Dialog.Content>
        <Dialog.Heading>Add New Pot</Dialog.Heading>
        <Dialog.Description>
          Create a pot to set savings targets. These can help keep you on track
          as you save for special purchases.
        </Dialog.Description>
        <AddPotForm
          defaultValue={{
            theme: defaultTheme.id,
          }}
        >
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
                  unavailable: t.Pot !== null,
                }))}
              />
              <Form.Message name="theme" />
            </Dialog.Group>
          </Dialog.Groups>
          <Button type="submit">Add Pot</Button>
        </AddPotForm>
      </Dialog.Content>
    </DialogPage>
  );
};

export default AddPotPage;
