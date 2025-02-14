import { type ComponentPropsWithRef } from "react";
import type Combobox from "~/app/_components/combobox";
import * as Form from "~/app/_components/form";
import { db } from "~/server/db";

type ThemesComboboxProps = ComponentPropsWithRef<typeof Combobox> & {
  name: string;
};

const ThemesCombobox = async (props: ThemesComboboxProps) => {
  const themes = await db.theme.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <Form.Combobox {...props}>
      {themes.map((theme) => {
        return (
          <option key={theme.id} value={theme.id}>
            {theme.name}
          </option>
        );
      })}
    </Form.Combobox>
  );
};

export default ThemesCombobox;
