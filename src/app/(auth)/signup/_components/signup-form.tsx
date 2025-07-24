"use client";

import { signUp } from "~/app/(auth)/signup/_actions";
import { schema } from "~/app/(auth)/signup/_schema";
import * as Form from "~/app/_components/form";
import * as FormUI from "~/app/_components/ui/form";
import { FormStatus } from "~/app/_components/form-status";
import { PasswordTextbox } from "~/app/_components/password-textbox";
import Status from "~/app/_components/status";
import Button from "~/app/_components/ui/button";
import Spinner from "~/app/_components/ui/spinner";

const SignupForm = () => {
  return (
    <Form.Root asChild action={signUp} schema={schema}>
      <form className="grid gap-400">
        <FormUI.Groups>
          <FormUI.Group>
            <Form.Label name="name">Name</Form.Label>
            <Form.Textbox name="name" />
            <Form.Message name="name" />
          </FormUI.Group>
          <FormUI.Group>
            <Form.Label name="email">Email</Form.Label>
            <Form.Textbox name="email" />
            <Form.Message name="email" />
          </FormUI.Group>
          <FormUI.Group>
            <Form.Label name="create-password">Password</Form.Label>
            <PasswordTextbox name="create-password" />
            <Form.Message name="create-password" />
          </FormUI.Group>
        </FormUI.Groups>
        <p>
          <Status className="sr-only">
            <FormStatus>
              {(status) => {
                return status.pending ? <>Creating account</> : null;
              }}
            </FormStatus>
          </Status>
          <Button className="w-full" type="submit">
            <FormStatus>
              {(status) => {
                return status.pending ? (
                  <>
                    <Spinner />
                    <span className="sr-only">Creating Account</span>
                  </>
                ) : (
                  <>Create Account</>
                );
              }}
            </FormStatus>
          </Button>
        </p>
      </form>
    </Form.Root>
  );
};

export default SignupForm;
