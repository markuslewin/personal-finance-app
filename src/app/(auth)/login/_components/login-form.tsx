"use client";

import { useState } from "react";
import { logIn } from "~/app/(auth)/login/_actions";
import { schema } from "~/app/(auth)/login/_schema";
import * as Form from "~/app/_components/form";
import * as Toggle from "@radix-ui/react-toggle";
import { Hydrated } from "~/app/_components/hydration";
import Button from "~/app/_components/ui/button";
import IconHidePassword from "~/app/_assets/icon-hide-password.svg";
import IconShowPassword from "~/app/_assets/icon-show-password.svg";
import Status from "~/app/_components/status";
import { FormStatus } from "~/app/_components/form-status";
import Spinner from "~/app/_components/ui/spinner";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Form.Root action={logIn} schema={schema}>
      <div className="grid gap-50">
        <Form.Label name="email">Email</Form.Label>
        <Form.Textbox name="email" />
        <Form.Message name="email" />
      </div>
      <div className="grid gap-50">
        <Form.Label name="password">Password</Form.Label>
        <div className="relative isolate">
          <Form.Textbox
            className="pr-[3.25rem]"
            type={showPassword ? "text" : "password"}
            name="password"
          />
          <Hydrated>
            <Toggle.Root
              className="absolute inset-y-0 right-250 my-auto grid size-200 place-items-center text-grey-900 transition-colors hocus:text-grey-500"
              pressed={showPassword}
              onPressedChange={setShowPassword}
            >
              {showPassword ? (
                <IconHidePassword className="h-[0.75rem]" />
              ) : (
                <IconShowPassword className="h-[0.625rem]" />
              )}
              <span className="sr-only">Show password</span>
            </Toggle.Root>
          </Hydrated>
        </div>
        <Form.Message name="password" />
      </div>
      <p>
        <Status className="sr-only">
          <FormStatus>
            {(status) => {
              return status.pending ? <>Logging in</> : null;
            }}
          </FormStatus>
        </Status>
        <Button className="w-full" type="submit">
          <FormStatus>
            {(status) => {
              return status.pending ? (
                <>
                  <Spinner />
                  <span className="sr-only">Logging In</span>
                </>
              ) : (
                <>Log In</>
              );
            }}
          </FormStatus>
        </Button>
      </p>
    </Form.Root>
  );
};

export default LoginForm;
