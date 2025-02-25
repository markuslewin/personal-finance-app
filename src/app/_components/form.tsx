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
import * as Dialog from "~/app/_components/ui/dialog";
import TextboxUI from "~/app/_components/ui/textbox";
import ComboboxUI from "~/app/_components/ui/combobox";
import type z from "zod";
import { type ZodTypeAny } from "zod";
import { cx } from "class-variance-authority";

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
  action,
  ...props
}: RootProps<Schema>) => {
  // todo: Move into `useAppForm`
  const [lastResult, formAction] = useActionState(action, undefined);
  const [form] = useAppForm({
    schema,
    defaultValue,
    lastResult,
    action: formAction,
  });

  return (
    <FormProvider context={form.context}>
      <Dialog.Form {...getFormProps(form)} action={formAction} {...props} />
    </FormProvider>
  );
};

type LabelProps = ComponentPropsWithRef<typeof Dialog.Label> & {
  name: string;
};

export const Label = ({ name, ...props }: LabelProps) => {
  const [meta] = useField(name);

  return <Dialog.Label htmlFor={meta.id} {...props} />;
};

type MessageProps = ComponentPropsWithRef<typeof Dialog.Message> & {
  name: string;
};

export const Message = ({ name, ...props }: MessageProps) => {
  const [meta] = useField(name);

  return (
    <Dialog.Message
      id={meta.errorId}
      {...props}
      className={cx(!meta.errors ? "hidden" : "")}
    >
      {meta.errors}
    </Dialog.Message>
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
