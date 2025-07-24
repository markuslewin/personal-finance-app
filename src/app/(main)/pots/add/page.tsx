import * as Dialog from "~/app/_components/ui/dialog";
import * as FormUI from "~/app/_components/ui/form";
import * as Form from "~/app/_components/form";
import ThemesCombobox from "~/app/_components/themes-combobox";
import Button from "~/app/_components/ui/button";
import AddPotForm from "~/app/(main)/pots/_components/add-pot-form";
import DialogPage from "~/app/_components/ui/dialog-page";
import Status from "~/app/_components/status";
import { Idle, Pending } from "~/app/_components/form-status";
import Spinner from "~/app/_components/ui/spinner";
import { getThemesWithPot } from "~/server/theme";
import { requireRealUser } from "~/app/_auth";
import { DollarTextbox } from "~/app/_components/dollar-textbox";

const AddPotPage = async () => {
  await requireRealUser();

  const themes = await getThemesWithPot();

  // todo: Disable "Add New Pot"
  const defaultTheme = themes.find((t) => t.pot === null);
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
          <FormUI.Groups>
            <FormUI.Group>
              <Form.Label name="name">Pot Name</Form.Label>
              <Form.Textbox name="name" placeholder="e.g. Rainy Days" />
              <Form.CharactersLeft name="name" />
            </FormUI.Group>
            <FormUI.Group>
              <Form.Label name="target">Target</Form.Label>
              <DollarTextbox name="target" placeholder="e.g. 2000" />
              <Form.Message name="target" />
            </FormUI.Group>
            <FormUI.Group>
              <Form.Label name="theme">Theme</Form.Label>
              <ThemesCombobox
                name="theme"
                themes={themes.map((t) => ({
                  ...t,
                  unavailable: t.pot !== null,
                }))}
              />
              <Form.Message name="theme" />
            </FormUI.Group>
          </FormUI.Groups>
          <Status className="sr-only">
            <Pending>Adding pot</Pending>
          </Status>
          <Button type="submit">
            <Idle>Add Pot</Idle>
            <Pending>
              <Spinner />
              <span className="sr-only">Adding Pot</span>
            </Pending>
          </Button>
        </AddPotForm>
      </Dialog.Content>
    </DialogPage>
  );
};

export default AddPotPage;
