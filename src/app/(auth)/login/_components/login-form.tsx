"use client";

import { logIn } from "~/app/(auth)/login/_actions";
import { schema } from "~/app/(auth)/login/_schema";
import * as Form from "~/app/_components/form";
import * as FormUI from "~/app/_components/ui/form";
import { FormStatus } from "~/app/_components/form-status";
import { PasswordTextbox } from "~/app/_components/password-textbox";
import Status from "~/app/_components/status";
import Button from "~/app/_components/ui/button";
import Spinner from "~/app/_components/ui/spinner";

const LoginForm = () => {
  return (
    <Form.Root asChild action={logIn} schema={schema}>
      <form className="grid gap-400">
        <FormUI.Groups>
          <FormUI.Group>
            <Form.Label name="email">Email</Form.Label>
            <Form.Textbox name="email" />
            <Form.Message name="email" />
          </FormUI.Group>
          <FormUI.Group>
            <Form.Label name="password">Password</Form.Label>
            <PasswordTextbox name="password" />
            <Form.Message name="password" />
          </FormUI.Group>
        </FormUI.Groups>
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
      </form>
    </Form.Root>
  );
};

export default LoginForm;
