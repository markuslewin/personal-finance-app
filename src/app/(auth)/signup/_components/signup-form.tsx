"use client";

import { signUp } from "~/app/(auth)/signup/_actions";
import { schema } from "~/app/(auth)/signup/_schema";
import * as Form from "~/app/_components/form";
import { FormStatus } from "~/app/_components/form-status";
import { PasswordTextbox } from "~/app/_components/password-textbox";
import Status from "~/app/_components/status";
import Button from "~/app/_components/ui/button";
import Spinner from "~/app/_components/ui/spinner";

const SignupForm = () => {
  return (
    <Form.Root action={signUp} schema={schema}>
      <div className="grid gap-50">
        <Form.Label name="name">Name</Form.Label>
        <Form.Textbox name="name" />
        <Form.Message name="name" />
      </div>
      <div className="grid gap-50">
        <Form.Label name="email">Email</Form.Label>
        <Form.Textbox name="email" />
        <Form.Message name="email" />
      </div>
      <div className="grid gap-50">
        <Form.Label name="create-password">Password</Form.Label>
        <PasswordTextbox name="create-password" />
        <Form.Message name="create-password" />
      </div>
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
    </Form.Root>
  );
};

export default SignupForm;
