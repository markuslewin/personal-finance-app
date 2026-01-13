/**
 * @jest-environment jsdom
 */
import "~/../tests/setup/jsdom-mocks";

import { expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "radix-ui";
import { type ReactNode } from "react";
import * as z from "zod";
import * as Form from "~/app/_components/form";

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

const TestEnhancedCombobox = ({ name }: { name: string }) => {
  return (
    <Form.EnhancedCombobox name={name}>
      <Form.EnhancedComboboxTrigger>
        <Select.Value />
        <Select.Icon />
      </Form.EnhancedComboboxTrigger>
      <Form.EnhancedComboboxPortal>
        <Form.EnhancedComboboxContent>
          {[
            { id: "1", name: "One" },
            { id: "2", name: "Two" },
            { id: "3", name: "Three" },
          ].map((category) => {
            return (
              <Select.Item key={category.id} value={category.id}>
                <Select.ItemText>{category.name}</Select.ItemText>
              </Select.Item>
            );
          })}
        </Form.EnhancedComboboxContent>
      </Form.EnhancedComboboxPortal>
    </Form.EnhancedCombobox>
  );
};

test("enhanced combobox has one tab stop", async () => {
  const { user } = setup(
    <Form.Root
      schema={z.object({})}
      action={async () => {
        return undefined;
      }}
    >
      <input aria-label="Before" />
      <Form.Label name="field">My field</Form.Label>
      <TestEnhancedCombobox name="field" />
      <Form.Message name="field" />
      <input aria-label="After" />
    </Form.Root>,
  );

  screen.getByRole("textbox", { name: /before/i }).focus();
  await user.tab();

  expect(screen.getByRole("combobox", { name: /my field/i })).toHaveFocus();

  await user.tab();

  expect(screen.getByRole("textbox", { name: /after/i })).toHaveFocus();
});

test("enhanced combobox can be validated", async () => {
  const { user } = setup(
    <Form.Root
      schema={z.object({
        field: z.literal("2"),
      })}
      action={async () => {
        return undefined;
      }}
      defaultValue={{
        field: "1",
      }}
    >
      <Form.Label name="field">My field</Form.Label>
      <TestEnhancedCombobox name="field" />
      <Form.Message name="field" />
      <button>Submit</button>
    </Form.Root>,
  );

  await user.click(screen.getByRole("button", { name: /submit/i }));

  expect(
    screen.getByRole("combobox", { name: /my field/i }),
  ).toHaveAccessibleDescription(/invalid/i);

  await user.click(screen.getByRole("combobox", { name: /my field/i }));
  await user.click(screen.getByRole("option", { name: /two/i }));
  await user.click(screen.getByRole("button", { name: /submit/i }));

  expect(
    screen.getByRole("combobox", { name: /my field/i }),
  ).toHaveAccessibleDescription("");
});

test("enhanced combobox trigger is focused when invalid", async () => {
  const { user } = setup(
    <Form.Root
      schema={z.object({
        field: z.literal("2"),
      })}
      action={async () => {
        return undefined;
      }}
      defaultValue={{
        field: "1",
      }}
    >
      <Form.Label name="field">My field</Form.Label>
      <TestEnhancedCombobox name="field" />
      <Form.Message name="field" />
      <button>Submit</button>
    </Form.Root>,
  );

  screen.getByRole("button", { name: /submit/i }).focus();
  await user.keyboard("{Enter}");

  expect(screen.getByRole("combobox", { name: /my field/i })).toHaveFocus();
});
