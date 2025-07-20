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
  useForm,
  useInputControl,
} from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { cx } from "class-variance-authority";
import {
  type ComponentPropsWithRef,
  createContext,
  type FocusEvent,
  type FocusEventHandler,
  type RefObject,
  startTransition,
  useActionState,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import type z from "zod";
import { type ZodTypeAny } from "zod";
import ComboboxUI from "~/app/_components/ui/combobox";
import * as Dialog from "~/app/_components/ui/dialog";
import * as Select from "~/app/_components/ui/select";
import TextboxUI from "~/app/_components/ui/textbox";

type RootProps<Schema extends ZodTypeAny> = Omit<
  ComponentPropsWithRef<"form">,
  "action" | "defaultValue"
> & {
  schema: Schema;
  defaultValue?: DefaultValue<z.input<Schema>>;
  dehydratedAction: (
    prevState: unknown,
    formData: FormData,
  ) => Promise<SubmissionResult<string[]>>;
  hydratedAction: (formData: FormData) => Promise<
    | { ok: false; result: SubmissionResult<string[]> }
    // todo: `data` generic
    | { ok: true; data: { redirect: string; budget: { id: string } } }
  >;
  onSuccess: (data: { redirect: string; budget: { id: string } }) => void;
};

export const Root = <Schema extends ZodTypeAny>({
  schema,
  defaultValue,
  dehydratedAction,
  hydratedAction,
  onSuccess,
  ...props
}: RootProps<Schema>) => {
  const [dehydratedLastResult, formAction] = useActionState(
    dehydratedAction,
    undefined,
  );
  const [hydratedLastResult, setHydratedLastResult] = useState<
    SubmissionResult<string[]> | undefined
  >(undefined);
  const [form] = useForm({
    constraint: getZodConstraint(schema),
    defaultValue,
    // todo:
    // We'd like to validate `onBlur`, but this causes dialogs to be focused when the user tabs out of an input
    // See https://github.com/radix-ui/primitives/issues/2436, and possibly https://github.com/radix-ui/primitives/issues/3185
    // - As a `focusout` event handler runs, the `document.activeElement` is temporarily set to `body` by the browser
    // - Conform creates a "submitter" `button` to `requestSubmit` in order to trigger validation
    // Radix's `FocusScope` listens for mutations. When it receives the mutation record of Conform's `button` mutations during a `focusout` event, it sees the `document.activeElement` is `body`, and brings the focus to `Dialog.Content`
    // shouldValidate: "onBlur",
    // shouldRevalidate: "onInput",
    shouldValidate: "onInput",
    lastResult: hydratedLastResult ?? dehydratedLastResult,
    onValidate: ({ formData }) => {
      return parseWithZod(formData, { schema });
    },
    // Avoid the automatic form reset of hydrated forms in React after server-side validation fails
    onSubmit: (e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      // `useFormStatus().isPending`
      startTransition(async () => {
        const response = await hydratedAction(formData);
        if (response.ok) {
          startTransition(() => {
            onSuccess(response.data);
          });
        } else {
          setHydratedLastResult(response.result);
        }
      });
    },
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
  type?: Parameters<typeof getInputProps>[1]["type"];
};

export const Textbox = ({ name, type = "text", ...props }: TextboxProps) => {
  const [meta] = useField(name);

  return (
    <TextboxUI
      {...getInputProps(meta, { type, ariaAttributes: true })}
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
