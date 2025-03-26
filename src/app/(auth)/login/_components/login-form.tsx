"use client";

import { useState } from "react";
import { login } from "~/app/(auth)/login/_action";
import { schema } from "~/app/(auth)/login/_schema";
import * as Form from "~/app/_components/form";
import { Hydrated } from "~/app/_components/hydration";
import Button from "~/app/_components/ui/button";
import IconHidePassword from "~/app/_assets/icon-hide-password.svg";
import IconShowPassword from "~/app/_assets/icon-show-password.svg";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Form.Root action={login} schema={schema}>
        <div className="grid gap-50">
          <Form.Label name="email">Email</Form.Label>
          <Form.Textbox name="email" />
          <Form.Message name="email" />
        </div>
        <div className="grid gap-50">
          <Form.Label name="password">Password</Form.Label>
          <Form.Textbox
            type={showPassword ? "text" : "password"}
            name="password"
          />
          <Hydrated>
            <button
              className="grid size-200 place-items-center text-grey-900 transition-colors hocus:text-grey-500"
              type="button"
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            >
              {showPassword ? (
                <>
                  <IconHidePassword className="h-[0.75rem]" />
                  <span className="sr-only">Hide password</span>
                </>
              ) : (
                <>
                  <IconShowPassword className="h-[0.625rem]" />
                  <span className="sr-only">Show password</span>
                </>
              )}
            </button>
          </Hydrated>
          <Form.Message name="password" />
        </div>
        <p>
          <Button className="w-full" type="submit">
            Log In
          </Button>
        </p>
      </Form.Root>
    </>
  );
};

export default LoginForm;
