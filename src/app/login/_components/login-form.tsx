"use client";

import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { cx } from "class-variance-authority";
import {
  startTransition,
  useActionState,
  type ComponentPropsWithoutRef,
} from "react";
import { login } from "~/app/login/_action";
import { schema } from "~/app/login/_schema";

type LoginFormProps = ComponentPropsWithoutRef<"form">;

const LoginForm = ({ className, ...props }: LoginFormProps) => {
  const [lastResult, action] = useActionState(login, undefined);
  const [form, fields] = useForm({
    lastResult,
    constraint: getZodConstraint(schema),
    onValidate: ({ formData }) => {
      return parseWithZod(formData, { schema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    // Avoid the automatic form reset of hydrated forms in React
    onSubmit: (e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      startTransition(() => {
        action(formData);
      });
    },
  });

  return (
    <form
      {...getFormProps(form)}
      action={action}
      {...props}
      className={cx(className, "")}
    >
      <div>
        <label htmlFor={fields.email.id}>Email</label>
        <input
          {...getInputProps(fields.email, { type: "email" })}
          key={fields.email.key}
        />
        <p id={fields.email.errorId}>{fields.email.errors}</p>
      </div>
      <div>
        <label htmlFor={fields.password.id}>Password</label>
        <input
          {...getInputProps(fields.password, { type: "password" })}
          key={fields.password.key}
        />
        <p id={fields.password.errorId}>{fields.password.errors}</p>
      </div>
      <p>
        <button type="submit">Login</button>
      </p>
      <p id={form.errorId}>{form.errors}</p>
    </form>
  );
};

export default LoginForm;
