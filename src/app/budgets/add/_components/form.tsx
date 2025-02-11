"use client";

import { getFormProps, getInputProps, getSelectProps } from "@conform-to/react";
import { cx } from "class-variance-authority";
import { useActionState, type ComponentPropsWithRef } from "react";
import Button from "~/app/_components/button";
import Combobox from "~/app/_components/combobox";
import Textbox from "~/app/_components/textbox";
import { useAppForm } from "~/app/_form";
import { add } from "~/app/budgets/add/_actions";
import { schema } from "~/app/budgets/add/_schema";

interface FormProps extends ComponentPropsWithRef<"form"> {
  categories: { id: string; name: string }[];
  themes: { id: string; name: string; color: string }[];
}

const Form = ({ className, categories, themes, ...props }: FormProps) => {
  // todo: Move into `useAppForm`
  const [lastResult, action] = useActionState(add, undefined);
  const [form, fields] = useAppForm({
    lastResult,
    schema,
    action,
  });

  return (
    <form
      {...getFormProps(form)}
      action={action}
      {...props}
      className={cx(className, "grid gap-250")}
    >
      <div className="grid gap-250">
        <div className="grid gap-50">
          <label className="text-preset-5-bold" htmlFor={fields.category.id}>
            Budget Category
          </label>
          <Combobox {...getSelectProps(fields.category)}>
            {categories.map((category) => {
              return (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              );
            })}
          </Combobox>
          <p className="text-end text-preset-5" id={fields.category.errorId}>
            {fields.category.errors}
          </p>
        </div>
        <div className="grid gap-50">
          <label className="text-preset-5-bold" htmlFor={fields.maximum.id}>
            Maximum Spend
          </label>
          <Textbox
            {...getInputProps(fields.maximum, { type: "text" })}
            key={fields.maximum.key}
            placeholder="e.g. 2000"
          />
          <p className="text-end text-preset-5" id={fields.maximum.errorId}>
            {fields.maximum.errors}
          </p>
        </div>
        <div className="grid gap-50">
          <label className="text-preset-5-bold" htmlFor={fields.theme.id}>
            Theme
          </label>
          <Combobox {...getSelectProps(fields.theme)}>
            {themes.map((theme) => {
              return (
                <option key={theme.id} value={theme.id}>
                  {theme.name}
                </option>
              );
            })}
          </Combobox>
        </div>
      </div>
      <Button type="submit">Add Budget</Button>
    </form>
  );
};

export default Form;
