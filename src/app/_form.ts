import {
  type DefaultValue,
  type SubmissionResult,
  useForm,
} from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { startTransition } from "react";
import { type z, type ZodTypeAny } from "zod";

interface AppFormOptions<Schema extends ZodTypeAny, FormError = string[]> {
  schema: Schema;
  defaultValue?: DefaultValue<z.input<Schema>>;
  lastResult?: SubmissionResult<FormError>;
  action: (formData: FormData) => void;
}

export const useAppForm = <Schema extends ZodTypeAny>({
  lastResult,
  schema,
  defaultValue,
  action,
}: AppFormOptions<Schema>) => {
  return useForm({
    constraint: getZodConstraint(schema),
    defaultValue,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
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
