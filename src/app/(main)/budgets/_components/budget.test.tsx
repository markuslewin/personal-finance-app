/**
 * @jest-environment jsdom
 */

import { test, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { type ReactNode, useState } from "react";
import userEvent from "@testing-library/user-event";
import { Budget } from "~/app/(main)/budgets/_components/budget";
import { faker } from "@faker-js/faker";
import { ProgressBarProvider } from "~/app/_components/progress";

jest.mock("next/navigation");
jest.mock("../_actions.ts");

const A = () => {
  const [count, setCount] = useState(0);

  return (
    <button
      onClick={() => {
        setCount(count + 1);
      }}
    >
      {count}
    </button>
  );
};

const setup = (jsx: ReactNode) => {
  return {
    user: userEvent.setup(),
    ...render(jsx, { wrapper: ProgressBarProvider }),
  };
};

test("demo interactions", async () => {
  const { user } = setup(<A />);

  await user.click(screen.getByRole("button", { name: "0" }));

  expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "1" }));

  expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
});

test("budget", () => {
  setup(
    <Budget
      budget={{
        id: faker.string.uuid(),
        maximum: 10000,
        category: {
          name: "My Category",
          transactions: [],
        },
        theme: {
          color: "green",
        },
      }}
      spent={7500}
    />,
  );

  expect(screen.getByTestId("budget")).toHaveStyle({
    "--theme-color": "green",
  });
  expect(
    screen.getByRole("heading", {
      name: /my category/i,
    }),
  ).toBeInTheDocument();
  expect(screen.getByText(/maximum/i)).toHaveTextContent(/\$100.00/i);
  expect(screen.getByTestId("budget-spent")).toHaveTextContent(/\$75.00/i);
  expect(screen.getByTestId("budget-free")).toHaveTextContent(/\$25.00/i);
});

test.todo("budget with negative spending");
