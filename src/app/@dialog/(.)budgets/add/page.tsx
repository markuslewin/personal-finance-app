import * as Dialog from "@radix-ui/react-dialog";
import RoutedDialog from "~/app/_components/routed-dialog";
import IconCloseModal from "~/app/_assets/icon-close-modal.svg";
import ServerForm from "~/app/budgets/add/_components/server-form";

const BudgetsAddPage = () => {
  return (
    <RoutedDialog>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 grid grid-cols-[minmax(auto,35rem)] items-center justify-center overflow-y-auto bg-[hsl(0_0%_0%/0.5)] p-250">
          <Dialog.Content
            asChild
            className="grid gap-250 rounded-xl bg-white px-250 py-300 text-grey-500 tablet:p-400"
          >
            <article>
              <header className="flex flex-wrap items-center justify-between">
                <Dialog.Title className="text-preset-1 text-grey-900">
                  Add New Budget
                </Dialog.Title>
                <Dialog.Close className="rounded-full transition-colors hocus:text-grey-900">
                  <IconCloseModal />
                  <span className="sr-only">Close</span>
                </Dialog.Close>
              </header>
              <Dialog.Description>
                Choose a category to set a spending budget. These categories can
                help you monitor spending.
              </Dialog.Description>
              <ServerForm />
            </article>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </RoutedDialog>
  );
};

export default BudgetsAddPage;
