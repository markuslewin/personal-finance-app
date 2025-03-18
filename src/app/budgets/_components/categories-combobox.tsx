import * as Form from "~/app/_components/form";
import * as Select from "~/app/_components/ui/select";
import { db } from "~/server/db";
import { Dehydrated, Hydrated } from "~/app/_components/hydration";
import { Fragment } from "react";

type CategoriesComboboxProps = {
  name: string;
};

const CategoriesCombobox = async ({ name }: CategoriesComboboxProps) => {
  const categories = await db.category.findMany({
    select: {
      id: true,
      name: true,
    },
    where: {
      Budget: {
        is: null,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <>
      <Dehydrated>
        <Form.Combobox name={name}>
          {categories.map((category) => {
            return (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            );
          })}
        </Form.Combobox>
      </Dehydrated>
      <Hydrated>
        <Form.EnhancedCombobox name={name}>
          <Form.EnhancedComboboxTrigger />
          <Form.EnhancedComboboxPortal>
            <Form.EnhancedComboboxContent>
              {categories.map((category, i) => {
                return (
                  <Fragment key={category.id}>
                    {i !== 0 ? <Select.Separator /> : null}
                    <Select.Item value={category.id}>
                      <Select.ItemText>{category.name}</Select.ItemText>
                      <Select.ItemIndicator />
                    </Select.Item>
                  </Fragment>
                );
              })}
            </Form.EnhancedComboboxContent>
          </Form.EnhancedComboboxPortal>
        </Form.EnhancedCombobox>
      </Hydrated>
    </>
  );
};

export default CategoriesCombobox;
