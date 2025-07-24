"use client";

import {
  type DefaultValue,
  type FieldMetadata,
  type FieldName,
  FormProvider,
  getFormProps,
  getInputProps,
  getSelectProps,
  type SubmissionResult,
  useField,
  useInputControl,
} from "@conform-to/react";
import {
  createContext,
  type FocusEvent,
  type FocusEventHandler,
  type RefObject,
  useActionState,
  useContext,
  useMemo,
  useRef,
  type ComponentPropsWithRef,
} from "react";
import { useAppForm } from "~/app/_form";
import * as FormUI from "~/app/_components/ui/form";
import TextboxUI from "~/app/_components/ui/textbox";
import ComboboxUI from "~/app/_components/ui/combobox";
import type z from "zod";
import { type ZodTypeAny } from "zod";
import { cx } from "class-variance-authority";
import * as Select from "~/app/_components/ui/select";
import { Dehydrated, Hydrated } from "~/app/_components/hydration";
import { nbsp } from "~/app/_unicode";

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
      <FormUI.Root {...getFormProps(form)} action={formAction} {...props} />
    </FormProvider>
  );
};

type LabelProps = ComponentPropsWithRef<typeof FormUI.Label> & {
  name: string;
};

export const Label = ({ name, ...props }: LabelProps) => {
  const [meta] = useField(name);

  return <FormUI.Label htmlFor={meta.id} {...props} />;
};

type MessageProps = ComponentPropsWithRef<typeof FormUI.Message> & {
  name: string;
};

export const Message = ({ name, ...props }: MessageProps) => {
  const [meta] = useField(name);

  return (
    <FormUI.Message
      id={meta.errorId}
      {...props}
      className={cx(!meta.errors ? "hidden" : "")}
    >
      {meta.errors}
    </FormUI.Message>
  );
};

type CharactersLeftProps = ComponentPropsWithRef<typeof FormUI.Message> & {
  name: string;
};

export const CharactersLeft = ({ name, ...props }: CharactersLeftProps) => {
  const [meta] = useField(name);

  const { maxLength } = meta;
  if (typeof maxLength !== "number") {
    throw new Error("Expected maxLength to be set");
  }

  const length = typeof meta.value === "string" ? meta.value.length : 0;

  return (
    <FormUI.Message id={meta.descriptionId} {...props}>
      <Hydrated>{Math.max(0, maxLength - length)} characters left</Hydrated>
      <Dehydrated>{nbsp}</Dehydrated>
    </FormUI.Message>
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
  type?: "text" | "password";
};

export const Textbox = ({ name, type = "text", ...props }: TextboxProps) => {
  const [meta] = useField(name);

  return (
    <TextboxUI
      {...getInputProps(meta, {
        type,
        ariaAttributes: true,
        ariaDescribedBy: meta.descriptionId,
      })}
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

type EnhancedComboboxContextValue = {
  contentRef: RefObject<HTMLDivElement | null>;
  triggerProps: ReturnType<typeof getEnhancedComboboxProps>["triggerProps"];
  handleBlur: FocusEventHandler;
} | null;

const EnhancedComboboxContext =
  createContext<EnhancedComboboxContextValue>(null);

const useEnhancedCombobox = () => {
  const value = useContext(EnhancedComboboxContext);
  if (value === null) {
    throw new Error("No provider for `useEnhancedCombobox`.");
  }

  return value;
};

type EnhancedComboboxProps = ComponentPropsWithRef<typeof Select.Root> & {
  name: FieldName<string>;
};

export const EnhancedCombobox = ({ name, ...props }: EnhancedComboboxProps) => {
  const [meta] = useField(name);
  const control = useInputControl(meta);
  const {
    rootProps: { key, ...rootProps },
    triggerProps,
  } = getEnhancedComboboxProps(meta);
  const contentRef = useRef<HTMLDivElement>(null);
  const contextValue: EnhancedComboboxContextValue = useMemo(() => {
    return {
      contentRef,
      triggerProps,
      handleBlur: (e: FocusEvent) => {
        if (!contentRef.current?.contains(e.relatedTarget)) {
          control.blur();
        }
      },
    };
  }, [control, triggerProps]);

  return (
    <EnhancedComboboxContext.Provider value={contextValue}>
      <Select.Root
        {...rootProps}
        key={key}
        value={control.value}
        onValueChange={(value) => {
          // Conform tries to set value of the visually hidden `select` before its `option`s have been rendered during hydration
          // Should be OK to ignore the resulting events, since the component is controlled
          if (value === "") {
            return;
          }
          control.change(value);
        }}
        {...props}
      />
    </EnhancedComboboxContext.Provider>
  );
};

type EnhancedComboboxTriggerProps = ComponentPropsWithRef<
  typeof Select.Trigger
>;

export const EnhancedComboboxTrigger = (
  props: EnhancedComboboxTriggerProps,
) => {
  const { triggerProps, handleBlur } = useEnhancedCombobox();

  return <Select.Trigger {...triggerProps} onBlur={handleBlur} {...props} />;
};

export const EnhancedComboboxPortal = Select.Portal;

type EnhancedComboboxContentProps = ComponentPropsWithRef<
  typeof Select.Content
>;

export const EnhancedComboboxContent = (
  props: EnhancedComboboxContentProps,
) => {
  const { contentRef } = useEnhancedCombobox();

  return <Select.Content ref={contentRef} {...props} />;
};

const getEnhancedComboboxProps = (meta: FieldMetadata) => {
  const props = getSelectProps(meta);

  return {
    rootProps: {
      // `Select.Root` only allows `string | undefined`
      defaultValue:
        typeof props.defaultValue === "string" ||
        props.defaultValue === undefined
          ? props.defaultValue
          : undefined,
      form: props.form,
      key: props.key,
      multiple: props.multiple,
      name: props.name,
      required: props.required,
    },
    triggerProps: {
      "aria-describedby": props["aria-describedby"],
      "aria-invalid": props["aria-invalid"],
      id: props.id,
    },
  };
};
