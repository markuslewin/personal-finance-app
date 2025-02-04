"use client";

import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { cx } from "class-variance-authority";
import { useActionState, type ComponentPropsWithoutRef } from "react";
import { signup } from "~/app/signup/_action";
import { schema } from "~/app/signup/_schema";

type SignupFormProps = ComponentPropsWithoutRef<"form">;

const SignupForm = ({ className, ...props }: SignupFormProps) => {
  const [lastResult, action] = useActionState(signup, undefined);
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
        <label htmlFor={fields.name.id}>Name</label>
        <input
          {...getInputProps(fields.name, { type: "text" })}
          key={fields.name.key}
        />
        <p id={fields.name.errorId}>{fields.name.errors}</p>
      </div>
      <div>
        <label htmlFor={fields.email.id}>Email</label>
        <input
          {...getInputProps(fields.email, { type: "email" })}
          key={fields.email.key}
        />
        <p id={fields.email.errorId}>{fields.email.errors}</p>
      </div>
      <div>
        <label htmlFor={fields["create-password"].id}>Create Password</label>
        <input
          {...getInputProps(fields["create-password"], { type: "password" })}
          key={fields["create-password"].key}
        />
        <p id={fields["create-password"].errorId}>
          {fields["create-password"].errors}
        </p>
      </div>
      <p>
        <button type="submit">Create Account</button>
      </p>
      <p id={form.errorId}>{form.errors}</p>
    </form>
  );
};

export default SignupForm;
