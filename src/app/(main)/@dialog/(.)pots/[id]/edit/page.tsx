import * as Dialog from "@radix-ui/react-dialog";
import RoutedDialog from "~/app/_components/routed-dialog";
import * as Form from "~/app/_components/form";
import * as DialogUI from "~/app/_components/ui/dialog";
import Button from "~/app/_components/ui/button";
import ThemesCombobox from "~/app/_components/themes-combobox";
import { db } from "~/server/db";
import { notFound } from "next/navigation";
import EditPotForm from "~/app/(main)/pots/_components/edit-pot-form";
import { Dehydrated, Hydrated } from "~/app/_components/hydration";
import { nbsp } from "~/app/_unicode";
import CharactersLeft from "~/app/(main)/pots/_components/characters-left";

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
                      target: pot.target,
                      theme: pot.theme.id,
                    }}
                  >
                    <Form.HiddenField name="id" />
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
                          <Hydrated>
                            <CharactersLeft name="name" /> characters left
                          </Hydrated>
                          <Dehydrated>{nbsp}</Dehydrated>
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
                            unavailable: t.Pot !== null && t.Pot.id !== pot.id,
                          }))}
                        />
                        <Form.Message name="theme" />
                      </DialogUI.Group>
                    </DialogUI.Groups>
                    <Button type="submit">Save Changes</Button>
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
