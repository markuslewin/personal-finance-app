import * as Dialog from "~/app/_components/ui/dialog";
import * as Form from "~/app/_components/form";
import AddBudgetForm from "~/app/budgets/add/_components/add-budget-form";
import CategoriesCombobox from "~/app/budgets/_components/categories-combobox";
import ThemesCombobox from "~/app/budgets/_components/themes-combobox";
import Button from "~/app/_components/ui/button";

const AddBudgetPage = () => {
  return (
    <Dialog.Content>
      <Dialog.Heading>Add New Budget</Dialog.Heading>
      <Dialog.Description>
        Choose a category to set a spending budget. These categories can help
        you monitor spending.
      </Dialog.Description>
      <AddBudgetForm>
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
        <Button type="submit">Add Budget</Button>
      </AddBudgetForm>
    </Dialog.Content>
  );
};

export default AddBudgetPage;
