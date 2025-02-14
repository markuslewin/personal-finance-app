"use client";

import {
  type DefaultValue,
  FormProvider,
  getFormProps,
  getInputProps,
  getSelectProps,
  type SubmissionResult,
  useField,
} from "@conform-to/react";
import { useActionState, type ComponentPropsWithRef } from "react";
import { useAppForm } from "~/app/_form";
import * as Card from "~/app/budgets/_components/card";
import TextboxUI from "~/app/_components/textbox";
import ComboboxUI from "~/app/_components/combobox";
import type z from "zod";
import { type ZodTypeAny } from "zod";

type RootProps<Schema extends ZodTypeAny> = Omit<
  ComponentPropsWithRef<"form">,
  "action" | "defaultValue"
> & {
  schema: Schema;
  defaultValue?: DefaultValue<z.input<Schema>>;
  action: (
    prevState: unknown,
    formData: FormData,
  ) => Promise<SubmissionResult<string[]> | undefined>;
};

export const Root = <Schema extends ZodTypeAny>({
  schema,
  defaultValue,
  action: _action,
  ...props
}: RootProps<Schema>) => {
  // todo: Move into `useAppForm`
  const [lastResult, action] = useActionState(_action, undefined);
  const [form] = useAppForm({
    schema,
    defaultValue,
    lastResult,
    action,
  });

  return (
    <FormProvider context={form.context}>
      <Card.Form {...getFormProps(form)} action={action} {...props} />
    </FormProvider>
  );
};

type LabelProps = ComponentPropsWithRef<typeof Card.Label> & {
  name: string;
};

export const Label = ({ name, ...props }: LabelProps) => {
  const [meta] = useField(name);

  return <Card.Label htmlFor={meta.id} {...props} />;
};

type MessageProps = ComponentPropsWithRef<typeof Card.Message> & {
  name: string;
};

export const Message = ({ name, ...props }: MessageProps) => {
  const [meta] = useField(name);

  return (
    <Card.Message id={meta.errorId} {...props}>
      {meta.errors}
    </Card.Message>
  );
};

type HiddenFieldProps = ComponentPropsWithRef<"input"> & {
  name: string;
};

export const HiddenField = ({ name, ...props }: HiddenFieldProps) => {
  const [meta] = useField(name);

  return <input {...getInputProps(meta, { type: "hidden" })} {...props} />;
};

type TextboxProps = ComponentPropsWithRef<typeof TextboxUI> & {
  name: string;
};

export const Textbox = ({ name, ...props }: TextboxProps) => {
  const [meta] = useField(name);

  return (
    <TextboxUI
      {...getInputProps(meta, { type: "text" })}
      key={meta.key}
      {...props}
    />
  );
};

type ComboboxProps = ComponentPropsWithRef<typeof ComboboxUI> & {
  name: string;
};

export const Combobox = ({ name, ...props }: ComboboxProps) => {
  const [meta] = useField(name);

  return <ComboboxUI {...getSelectProps(meta)} {...props} />;
};
