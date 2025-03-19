import { cx } from "class-variance-authority";
import { Fragment } from "react";
import * as Form from "~/app/_components/form";
import { Dehydrated, Hydrated } from "~/app/_components/hydration";
import * as Select from "~/app/_components/ui/select";

type ThemesComboboxProps = {
  name: string;
  themes: {
    id: string;
    name: string;
    color: string;
    unavailable: boolean;
  }[];
};

const ThemesCombobox = async ({ name, themes }: ThemesComboboxProps) => {
  return (
    <>
      <Dehydrated>
        <Form.Combobox name={name}>
          {themes
            .filter((t) => !t.unavailable)
            .map((theme) => {
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
          <Form.EnhancedComboboxTrigger>
            <Select.Value />
            <Select.Icon />
          </Form.EnhancedComboboxTrigger>
          <Form.EnhancedComboboxPortal>
            <Form.EnhancedComboboxContent>
              {themes.map((theme, i) => {
                return (
                  <Fragment key={theme.id}>
                    {i !== 0 ? <Select.Separator /> : null}
                    <Select.ColorItem
                      className={cx(theme.unavailable ? "text-grey-500" : "")}
                      value={theme.id}
                      disabled={theme.unavailable}
                    >
                      <Select.ItemText>
                        <span
                          className={cx(
                            "mr-150 inline-block size-200 translate-y-[0.1875rem] rounded-full",
                            theme.unavailable ? "opacity-10" : "",
                          )}
                          style={{ background: theme.color }}
                        />
                        {theme.name}
                      </Select.ItemText>
                      {theme.unavailable ? (
                        <span className="text-preset-5" aria-hidden="true">
                          Already used
                        </span>
                      ) : (
                        <Select.ItemIndicator />
                      )}
                    </Select.ColorItem>
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

export default ThemesCombobox;
