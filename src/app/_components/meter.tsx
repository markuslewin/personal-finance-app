"use client";

import { cx } from "class-variance-authority";
import { type ComponentPropsWithRef } from "react";

type RootProps = ComponentPropsWithRef<"span"> & {
  min: number;
  max: number;
  value: number;
};

// Name with `aria-label`, `aria-labelledby`
export const Root = ({ className, max, min, value, ...props }: RootProps) => {
  return (
    <span
      role="meter"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={Math.min(max, Math.max(min, value))}
      {...props}
      className={cx(className, "")}
    />
  );
};

type IndicatorProps = ComponentPropsWithRef<"span">;

export const Indicator = ({ className, ...props }: IndicatorProps) => {
  return <span {...props} className={cx(className, "")} />;
};
