import { type ComponentPropsWithRef } from "react";
import type Combobox from "~/app/_components/combobox";
import * as Form from "~/app/_components/form";
import { type BudgetSchema } from "~/app/budgets/_schemas";
import { db } from "~/server/db";

type CategoriesComboboxProps = ComponentPropsWithRef<typeof Combobox> & {
  name: keyof BudgetSchema;
};

const CategoriesCombobox = async ({
  name,
  ...props
}: CategoriesComboboxProps) => {
  const categories = await db.category.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <Form.TestCombobox name={name} {...props}>
      {categories.map((category) => {
        return (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        );
      })}
    </Form.TestCombobox>
  );
};

export default CategoriesCombobox;
