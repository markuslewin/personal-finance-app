import { type ComponentPropsWithRef } from "react";
import type Combobox from "~/app/_components/ui/combobox";
import * as Form from "~/app/_components/form";
import { db } from "~/server/db";

type CategoriesComboboxProps = ComponentPropsWithRef<typeof Combobox> & {
  name: string;
};

const CategoriesCombobox = async (props: CategoriesComboboxProps) => {
  const categories = await db.category.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <Form.Combobox {...props}>
      {categories.map((category) => {
        return (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        );
      })}
    </Form.Combobox>
  );
};

export default CategoriesCombobox;
