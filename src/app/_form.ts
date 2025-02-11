import { type SubmissionResult, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { startTransition } from "react";
import { type ZodTypeAny } from "zod";

interface AppFormOptions<Schema extends ZodTypeAny, FormError = string[]> {
  lastResult?: SubmissionResult<FormError>;
  schema: Schema;
  action: (formData: FormData) => void;
}

export const useAppForm = <Schema extends ZodTypeAny>({
  lastResult,
  schema,
  action,
}: AppFormOptions<Schema>) => {
  return useForm({
    lastResult,
    constraint: getZodConstraint(schema),
    onValidate: ({ formData }) => {
      return parseWithZod(formData, { schema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
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
