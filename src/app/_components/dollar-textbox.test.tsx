/**
 * @jest-environment jsdom
 */

import { test, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { type ReactNode } from "react";
import userEvent from "@testing-library/user-event";
import * as Form from "~/app/_components/form";
import { z } from "zod";
import { DollarTextbox } from "~/app/_components/dollar-textbox";

const setup = (jsx: ReactNode) => {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
};

test("specifies currency", async () => {
  const {} = setup(
    <Form.Root
      schema={z.object({
        amount: z.string(),
      })}
      action={async () => {
        return undefined;
      }}
    >
      <Form.Label name="amount">Amount</Form.Label>
      <DollarTextbox name="amount" />
    </Form.Root>,
  );

  const textbox = screen.getByRole("textbox", { name: /amount/i });
  expect(textbox).toHaveAccessibleDescription(/in dollars/i);
});

test("specifies currency and message", async () => {
  const { user } = setup(
    <Form.Root
      schema={z.object({
        amount: z.string(),
      })}
      action={async () => {
        return undefined;
      }}
    >
      <Form.Label name="amount">Amount</Form.Label>
      <DollarTextbox name="amount" />
      <Form.Message name="amount" />
    </Form.Root>,
  );

  const textbox = screen.getByRole("textbox", { name: /amount/i });

  // Trigger validation
  await user.type(textbox, "123");
  await user.clear(textbox);

  expect(textbox).toHaveAccessibleDescription(/in dollars/i);
  expect(textbox).toHaveAccessibleDescription(/required/i);
});
