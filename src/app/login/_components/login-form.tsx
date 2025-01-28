"use client";

import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { cx } from "class-variance-authority";
import { useActionState, type ComponentPropsWithoutRef } from "react";
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
        <input {...getInputProps(fields.email, { type: "email" })} />
        <p id={fields.email.errorId}>{fields.email.errors}</p>
      </div>
      <div>
        <label htmlFor={fields.password.id}>Password</label>
        <input {...getInputProps(fields.password, { type: "password" })} />
        <p id={fields.password.errorId}>{fields.password.errors}</p>
      </div>
      <p>
        <button type="submit">Login</button>
      </p>
    </form>
  );
};

export default LoginForm;
