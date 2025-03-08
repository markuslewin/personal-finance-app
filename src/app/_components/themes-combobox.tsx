import { type ComponentPropsWithRef } from "react";
import type Combobox from "~/app/_components/ui/combobox";
import * as Form from "~/app/_components/form";
import { db } from "~/server/db";
import { Dehydrated, Hydrated } from "~/app/_components/hydration";
import { SelectItem } from "~/app/_components/ui/select";

type ThemesComboboxProps = ComponentPropsWithRef<typeof Combobox> & {
  name: string;
};

const ThemesCombobox = async (props: ThemesComboboxProps) => {
  const themes = await db.theme.findMany({
    select: {
      id: true,
      name: true,
      color: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <Form.Combobox {...props}>
      {/* <Dehydrated>
        {themes.map((theme) => {
          return (
            <option key={theme.id} value={theme.id}>
              {theme.name}
            </option>
          );
        })}
      </Dehydrated>
      <Hydrated>
        {themes.map((theme) => {
          return (
            <SelectItem key={theme.id} value={theme.id}>
              <span
                className="inline-block size-200 rounded-full"
                style={{ background: theme.color }}
              />
              {theme.name}
            </SelectItem>
          );
        })}
      </Hydrated> */}
    </Form.Combobox>
  );
};

export default ThemesCombobox;
