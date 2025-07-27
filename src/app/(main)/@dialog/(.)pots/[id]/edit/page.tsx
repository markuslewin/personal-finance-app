import * as Dialog from "@radix-ui/react-dialog";
import RoutedDialog from "~/app/_components/routed-dialog";
import * as Form from "~/app/_components/form";
import * as DialogUI from "~/app/_components/ui/dialog";
import * as FormUI from "~/app/_components/ui/form";
import Button from "~/app/_components/ui/button";
import ThemesCombobox from "~/app/_components/themes-combobox";
import { notFound } from "next/navigation";
import EditPotForm from "~/app/(main)/pots/_components/edit-pot-form";
import Status from "~/app/_components/status";
import { Idle, Pending } from "~/app/_components/form-status";
import Spinner from "~/app/_components/ui/spinner";
import { getPot } from "~/server/pot";
import { getThemesWithPot } from "~/server/theme";
import { requireRealUser } from "~/app/_auth";
import { DollarTextbox } from "~/app/_components/dollar-textbox";
import { toDollarValue } from "~/app/_currency";

const EditPotPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  await requireRealUser();

  const id = (await params).id;
  const [pot, themes] = await Promise.all([getPot(id), getThemesWithPot()]);
  if (!pot) {
    notFound();
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
                        <h2>Edit Pot</h2>
                      </DialogUI.Heading>
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <DialogUI.Close />
                    </Dialog.Close>
                  </DialogUI.Header>
                  <Dialog.Description asChild>
                    <DialogUI.Description>
                      If your saving targets change, feel free to update your
                      pots.
                    </DialogUI.Description>
                  </Dialog.Description>
                  <EditPotForm
                    defaultValue={{
                      id: pot.id,
                      name: pot.name,
                      target: toDollarValue(pot.target),
                      theme: pot.theme.id,
                    }}
                  >
                    <Form.HiddenField name="id" />
                    <FormUI.Groups>
                      <FormUI.Group>
                        <Form.Label name="name">Pot Name</Form.Label>
                        <Form.Textbox
                          name="name"
                          placeholder="e.g. Rainy Days"
                        />
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
                            unavailable: t.pot !== null && t.pot.id !== pot.id,
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
                  </EditPotForm>
                </article>
              </DialogUI.Content>
            </Dialog.Content>
          </DialogUI.Overlay>
        </Dialog.Overlay>
      </Dialog.Portal>
    </RoutedDialog>
  );
};

export default EditPotPage;
