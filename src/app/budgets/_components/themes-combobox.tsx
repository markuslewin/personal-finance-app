import { cx } from "class-variance-authority";
import { type ComponentPropsWithRef } from "react";
import Combobox from "~/app/_components/combobox";
import { db } from "~/server/db";

type ThemesComboboxProps = ComponentPropsWithRef<typeof Combobox>;

const ThemesCombobox = async ({ className, ...props }: ThemesComboboxProps) => {
  const themes = await db.theme.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <Combobox {...props} className={cx(className, "")}>
      {themes.map((theme) => {
        return (
          <option key={theme.id} value={theme.id}>
            {theme.name}
          </option>
        );
      })}
    </Combobox>
  );
};

export default ThemesCombobox;
