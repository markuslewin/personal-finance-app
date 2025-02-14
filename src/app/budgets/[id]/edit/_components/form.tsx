"use client";

import { getFormProps, getInputProps } from "@conform-to/react";
import { cx } from "class-variance-authority";
import { useActionState, type ComponentPropsWithRef } from "react";
import { z } from "zod";
import Button from "~/app/_components/button";
import { useAppForm } from "~/app/_form";
import { edit } from "~/app/budgets/_actions";
import { budgetSchema } from "~/app/budgets/_schemas";
import * as Card from "~/app/budgets/_components/card";
import Textbox from "~/app/_components/textbox";
import CategoriesCombobox from "~/app/budgets/_components/categories-combobox";
import ThemesCombobox from "~/app/budgets/_components/themes-combobox";

interface FormProps extends ComponentPropsWithRef<"form"> {
  id: string;
}

const Form = ({ className, id, ...props }: FormProps) => {
  const [lastResult, action] = useActionState(edit, undefined);
  const [form, fields] = useAppForm({
    lastResult,
    schema: budgetSchema.extend({
      id: z.string(),
    }),
    defaultValue: {
      id,
    },
    action,
  });

  return (
    <Card.Form
      {...getFormProps(form)}
      action={action}
      {...props}
      className={cx(className, "")}
    >
      <input {...getInputProps(fields.id, { type: "hidden" })} />
      <Card.Groups>
        <Card.Group>
          <Card.Label htmlFor={fields.category.id}>Budget Category</Card.Label>
          {/* todo: Form specific name... */}
          <CategoriesCombobox name="category" />
          <Card.Message id={fields.category.errorId}>
            {fields.category.errors}
          </Card.Message>
        </Card.Group>
        <Card.Group>
          <Card.Label htmlFor={fields.maximum.id}>Maximum Spend</Card.Label>
          <Textbox
            {...getInputProps(fields.maximum, { type: "text" })}
            key={fields.maximum.key}
            placeholder="e.g. 2000"
          />
          <Card.Message id={fields.maximum.errorId}>
            {fields.maximum.errors}
          </Card.Message>
        </Card.Group>
        <Card.Group>
          <Card.Label htmlFor={fields.theme.id}>Theme</Card.Label>
          <ThemesCombobox />
        </Card.Group>
      </Card.Groups>
      <Button type="submit">Save Changes</Button>
    </Card.Form>
  );
};

export default Form;
