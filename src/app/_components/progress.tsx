// https://github.com/vercel/react-transition-progress/blob/7accf8868e86a50e7276eaa977ab4a3b1630c702/src/index.tsx
"use client";

import { cx } from "class-variance-authority";
import {
  useContext,
  createContext,
  type ReactNode,
  useOptimistic,
  useState,
  useEffect,
  useRef,
} from "react";

const ProgressContext = createContext<{
  value: number;
  loading: boolean;
  start: () => void;
} | null>(null);

type ProgressProps = {
  children: ReactNode;
};

const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getDiff = (current: number): number => {
  let diff;
  if (current === 0) {
    diff = 15;
  } else if (current < 50) {
    diff = random(1, 10);
  } else {
    diff = random(1, 5);
  }

  return diff;
};

const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      tick();

      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

export const ProgressBarProvider = (props: ProgressProps) => {
  const [loading, setLoading] = useOptimistic(false);
  const [value, setValue] = useState(0);

  useInterval(
    () => {
      setValue((value) => {
        return Math.min(value + getDiff(value), 99);
      });
    },
    loading ? 750 : null,
  );

  useEffect(() => {
    if (!loading) {
      setValue(0);
    }
  }, [loading]);

  return (
    <ProgressContext.Provider
      value={{
        value,
        loading,
        start: () => {
          setLoading(true);
        },
      }}
      {...props}
    />
  );
};

export const useProgress = () => {
  const value = useContext(ProgressContext);
  if (value === null) {
    throw new Error("`useProgress` must be used inside of `ProgressContext`");
  }
  return value;
};

export const ProgressBar = () => {
  const { loading, value } = useProgress();

  return (
    <div
      className={cx(
        "pointer-events-none fixed inset-x-0 top-0 bg-white transition-opacity",
        loading ? "opacity-100" : "opacity-0",
      )}
      data-testid="progress-bar-root"
    >
      <div
        className="h-50 origin-left bg-grey-900 transition-transform ease-initial"
        style={{
          transform: `scaleX(${value / 100})`,
        }}
        data-testid="progress-bar-indicator"
      />
    </div>
  );
};
