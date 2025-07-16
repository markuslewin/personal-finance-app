/**
 * @jest-environment jsdom
 */

import { expect, jest, test } from "@jest/globals";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ReactNode, startTransition } from "react";
import {
  ProgressBar,
  ProgressBarProvider,
  useProgress,
} from "~/app/_components/progress";

jest.useFakeTimers();

const createPromiseManager = () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  let resolve: (value: unknown) => void = () => {};
  const promise = new Promise((r) => {
    resolve = r;
  });
  return { promise, resolve };
};

const setup = (jsx: ReactNode) => {
  return {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    user: userEvent.setup({ advanceTimers: jest.advanceTimersByTime }),
    ...render(jsx),
  };
};

const ProgressBarWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <ProgressBarProvider>
      <ProgressBar />
      {children}
    </ProgressBarProvider>
  );
};

test("visible when loading", async () => {
  const { promise, resolve } = createPromiseManager();

  const Test = () => {
    const progress = useProgress();
    return (
      <button
        type="button"
        onClick={() => {
          startTransition(async () => {
            progress.start();
            await promise;
          });
        }}
      >
        Toggle loading
      </button>
    );
  };

  const { user } = setup(
    <ProgressBarWrapper>
      <Test />
    </ProgressBarWrapper>,
  );

  const progressBarRoot = screen.getByTestId("progress-bar-root");
  expect(progressBarRoot).toHaveClass("opacity-0");

  await user.click(screen.getByRole("button", { name: /toggle loading/i }));

  expect(progressBarRoot).toHaveClass("opacity-100");

  await act(async () => {
    resolve(undefined);
  });

  expect(progressBarRoot).toHaveClass("opacity-0");
});

test("increments value", async () => {
  const mathRandom = jest.spyOn(Math, "random").mockReturnValue(0.5);

  const { promise } = createPromiseManager();
  const Test = () => {
    const progress = useProgress();
    return (
      <button
        type="button"
        onClick={() => {
          startTransition(async () => {
            progress.start();
            await promise;
          });
        }}
      >
        Toggle loading
      </button>
    );
  };

  const { user } = setup(
    <ProgressBarWrapper>
      <Test />
    </ProgressBarWrapper>,
  );

  await user.click(screen.getByRole("button", { name: /toggle loading/i }));

  const progressBarIndicator = screen.getByTestId("progress-bar-indicator");
  const firstValue = getValue(progressBarIndicator.style.transform);
  expect(firstValue).toBe(0.15);

  await act(async () => {
    await jest.runOnlyPendingTimersAsync();
  });

  const secondValue = getValue(progressBarIndicator.style.transform);
  expect(secondValue).toBeGreaterThan(firstValue);

  await act(async () => {
    await jest.runOnlyPendingTimersAsync();
  });

  const thirdValue = getValue(progressBarIndicator.style.transform);
  expect(thirdValue).toBeGreaterThan(secondValue);

  await act(async () => {
    await jest.advanceTimersByTimeAsync(60_000);
  });

  const finalValue = getValue(progressBarIndicator.style.transform);
  expect(finalValue).toBe(0.99);

  mathRandom.mockRestore();
});

const getValue = (scale: string) => {
  const value = /scaleX\((?<value>\d+\.\d+)\)/.exec(scale)?.groups?.value;
  if (value === undefined) {
    throw new Error("Expected match");
  }
  return Number(value);
};
