/**
 * @jest-environment jsdom
 */

import { test, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { type ReactNode } from "react";
import userEvent from "@testing-library/user-event";
import * as Form from "~/app/_components/form";
import { z } from "zod";

const setup = (jsx: ReactNode) => {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
};

test("shows characters left", async () => {
  const { user } = setup(
    <Form.Root
      schema={z.object({
        field: z.string().max(30),
      })}
      action={async () => {
        return undefined;
      }}
    >
      <Form.Label name="field">My field</Form.Label>
      <Form.Textbox name="field" />
      <Form.CharactersLeft name="field" />
    </Form.Root>,
  );

  const textbox = screen.getByRole("textbox", { name: /my field/i });
  expect(textbox).toHaveAccessibleDescription(/30 characters left/i);

  await user.type(textbox, "Hi");

  expect(textbox).toHaveAccessibleDescription(/28 characters left/i);

  await user.type(textbox, ", let's type some characters");

  expect(textbox).toHaveAccessibleDescription(/0 characters left/i);

  // Additional characters are discarded
  await user.type(textbox, "a");

  expect(textbox).toHaveValue("Hi, let's type some characters");
  expect(textbox).toHaveAccessibleDescription(/0 characters left/i);
});
