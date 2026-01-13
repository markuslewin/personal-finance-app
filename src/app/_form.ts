import {
  type DefaultValue,
  type SubmissionResult,
  useForm,
} from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod/v4";
import { startTransition } from "react";
import { type z } from "zod";

interface AppFormOptions<Schema extends z.ZodObject, FormError = string[]> {
  schema: Schema;
  defaultValue?: DefaultValue<z.input<Schema>>;
  lastResult?: SubmissionResult<FormError>;
  action: (formData: FormData) => void;
}

export const useAppForm = <Schema extends z.ZodObject>({
  lastResult,
  schema,
  defaultValue,
  action,
}: AppFormOptions<Schema>) => {
  return useForm({
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
    lastResult,
    onValidate: ({ formData }) => {
      return parseWithZod(formData, { schema });
    },
    // Avoid the automatic form reset of hydrated forms in React after server-side validation fails
    onSubmit: (e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      startTransition(() => {
        action(formData);
      });
    },
  });
};
