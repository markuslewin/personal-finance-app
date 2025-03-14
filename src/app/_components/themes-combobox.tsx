import * as Form from "~/app/_components/form";
import { db } from "~/server/db";
import { Dehydrated, Hydrated } from "~/app/_components/hydration";
import * as Select from "~/app/_components/ui/select";

type ThemesComboboxProps = {
  name: string;
};

const ThemesCombobox = async ({ name }: ThemesComboboxProps) => {
  // todo: Hoist to check availability
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
    <>
      <Dehydrated>
        <Form.Combobox name={name}>
          {themes.map((theme) => {
            return (
              <option key={theme.id} value={theme.id}>
                {theme.name}
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
              {themes.map((theme) => {
                return (
                  <Select.Item key={theme.id} value={theme.id}>
                    <Select.ItemText>
                      <span
                        className="mr-150 inline-block size-200 translate-y-[0.1875rem] rounded-full"
                        style={{ background: theme.color }}
                      />
                      {theme.name}
                    </Select.ItemText>
                    <Select.ItemIndicator />
                  </Select.Item>
                );
              })}
            </Form.EnhancedComboboxContent>
          </Form.EnhancedComboboxPortal>
        </Form.EnhancedCombobox>
      </Hydrated>
    </>
  );
};

export default ThemesCombobox;
