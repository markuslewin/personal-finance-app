import * as Dialog from "@radix-ui/react-dialog";
import RoutedDialog from "~/app/_components/routed-dialog";
import * as Form from "~/app/_components/form";
import * as DialogUI from "~/app/_components/ui/dialog";
import Button from "~/app/_components/ui/button";
import ThemesCombobox from "~/app/_components/themes-combobox";
import AddPotForm from "~/app/(main)/pots/_components/add-pot-form";
import CharactersLeft from "~/app/(main)/pots/_components/characters-left";
import Status from "~/app/_components/status";
import { Idle, Pending } from "~/app/_components/form-status";
import Spinner from "~/app/_components/ui/spinner";
import { getThemesWithPot } from "~/server/theme";
import { requireRealUser } from "~/app/_auth";

const AddPotPage = async () => {
  await requireRealUser();

  const themes = await getThemesWithPot();

  // todo: Disable "Add New Pot"
  const defaultTheme = themes.find((t) => t.pot === null);
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
                        <h2>Add New Pot</h2>
                      </DialogUI.Heading>
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <DialogUI.Close />
                    </Dialog.Close>
                  </DialogUI.Header>
                  <Dialog.Description asChild>
                    <DialogUI.Description>
                      Create a pot to set savings targets. These can help keep
                      you on track as you save for special purchases.
                    </DialogUI.Description>
                  </Dialog.Description>
                  <AddPotForm
                    defaultValue={{
                      theme: defaultTheme.id,
                    }}
                  >
                    <DialogUI.Groups>
                      <DialogUI.Group>
                        <Form.Label name="name">Pot Name</Form.Label>
                        <Form.Textbox
                          name="name"
                          placeholder="e.g. Rainy Days"
                        />
                        <Form.Message name="name" />
                        {/* todo: ARIA description */}
                        <DialogUI.Message>
                          <CharactersLeft name="name" /> characters left
                        </DialogUI.Message>
                      </DialogUI.Group>
                      <DialogUI.Group>
                        <Form.Label name="target">Target</Form.Label>
                        <Form.Textbox name="target" placeholder="e.g. 2000" />
                        <Form.Message name="target" />
                      </DialogUI.Group>
                      <DialogUI.Group>
                        <Form.Label name="theme">Theme</Form.Label>
                        <ThemesCombobox
                          name="theme"
                          themes={themes.map((t) => ({
                            ...t,
                            unavailable: t.pot !== null,
                          }))}
                        />
                        <Form.Message name="theme" />
                      </DialogUI.Group>
                    </DialogUI.Groups>
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
                </article>
              </DialogUI.Content>
            </Dialog.Content>
          </DialogUI.Overlay>
        </Dialog.Overlay>
      </Dialog.Portal>
    </RoutedDialog>
  );
};

export default AddPotPage;
