/**
 * @jest-environment jsdom
 */

import { test, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { type ReactNode } from "react";
import userEvent from "@testing-library/user-event";
import * as Form from "~/app/_components/form";
import * as z from "zod";
import { PasswordTextbox } from "~/app/_components/password-textbox";

const setup = (jsx: ReactNode) => {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
};

test("toggles visibility", async () => {
  const { user } = setup(
    <Form.Root
      schema={z.object({
        password: z.string(),
      })}
      action={async () => {
        return undefined;
      }}
    >
      <Form.Label name="password">Password</Form.Label>
      <PasswordTextbox name="password" />
    </Form.Root>,
  );

  const textbox = screen.getByLabelText(/password/i);
  const toggle = screen.getByRole("button", { name: /show password/i });
  await user.type(textbox, "my password");

  expect(textbox).toHaveAttribute("type", "password");
  expect(toggle).not.toBePressed();

  await user.click(toggle);

  expect(textbox).toHaveAttribute("type", "text");
  expect(toggle).toBePressed();

  await user.click(toggle);

  expect(textbox).toHaveAttribute("type", "password");
  expect(toggle).not.toBePressed();
});
