"use client";

import {
  FormProvider,
  getFormProps,
  getInputProps,
  getSelectProps,
  useField,
} from "@conform-to/react";
import { cx } from "class-variance-authority";
import { useActionState, type ComponentPropsWithRef } from "react";
import { useAppForm } from "~/app/_form";
import { add } from "~/app/budgets/_actions";
import { budgetSchema, type BudgetSchema } from "~/app/budgets/_schemas";
import * as Card from "~/app/budgets/_components/card";
import Textbox from "~/app/_components/textbox";
import Combobox from "~/app/_components/combobox";

type RootProps = ComponentPropsWithRef<"form">;

export const Root = ({ className, ...props }: RootProps) => {
  // todo: Move into `useAppForm`
  const [lastResult, action] = useActionState(add, undefined);
  const [form] = useAppForm({
    lastResult,
    schema: budgetSchema,
    action,
  });

  return (
    <FormProvider context={form.context}>
      <Card.Form
        {...getFormProps(form)}
        action={action}
        {...props}
        className={cx(className, "")}
      />
    </FormProvider>
  );
};

type LabelProps = ComponentPropsWithRef<typeof Card.Label> & {
  name: keyof BudgetSchema;
};

export const Label = ({ name, ...props }: LabelProps) => {
  const [meta] = useField(name);

  return <Card.Label htmlFor={meta.id} {...props} />;
};

type MessageProps = ComponentPropsWithRef<typeof Card.Message> & {
  name: keyof BudgetSchema;
};

export const Message = ({ name, ...props }: MessageProps) => {
  const [meta] = useField(name);

  return (
    <Card.Message id={meta.errorId} {...props}>
      {meta.errors}
    </Card.Message>
  );
};

type TestTextboxProps = ComponentPropsWithRef<typeof Textbox> & {
  name: keyof BudgetSchema;
};

export const TestTextbox = ({ name, ...props }: TestTextboxProps) => {
  const [meta] = useField(name);

  return (
    <Textbox
      {...getInputProps(meta, { type: "text" })}
      key={meta.key}
      {...props}
    />
  );
};

type TestComboboxProps = ComponentPropsWithRef<typeof Combobox> & {
  name: keyof BudgetSchema;
};

export const TestCombobox = ({ name, ...props }: TestComboboxProps) => {
  const [meta] = useField(name);

  return <Combobox {...getSelectProps(meta)} {...props} />;
};
