import CategoriesCombobox from "~/app/budgets/_components/categories-combobox";
import ThemesCombobox from "~/app/budgets/_components/themes-combobox";
import * as Form from "~/app/_components/form";
import * as Card from "~/app/budgets/_components/card";
import Button from "~/app/_components/button";

const AddBudgetPage = () => {
  return (
    <Card.Root>
      <Card.Heading>Add New Budget</Card.Heading>
      <Card.Description>
        Choose a category to set a spending budget. These categories can help
        you monitor spending.
      </Card.Description>
      <Form.Root>
        <Card.Groups>
          <Card.Group>
            <Form.Label name="category">Budget Category</Form.Label>
            <CategoriesCombobox name="category" />
            <Form.Message name="category" />
          </Card.Group>
          <Card.Group>
            <Form.Label name="maximum">Maximum Spend</Form.Label>
            <Form.TestTextbox name="maximum" placeholder="e.g. 2000" />
            <Form.Message name="maximum" />
          </Card.Group>
          <Card.Group>
            <Form.Label name="theme">Theme</Form.Label>
            <ThemesCombobox />
            <Form.Message name="theme" />
          </Card.Group>
        </Card.Groups>
        <Button type="submit">Add Budget</Button>
      </Form.Root>
    </Card.Root>
  );
};

export default AddBudgetPage;
