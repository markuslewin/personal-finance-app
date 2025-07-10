"use client";

import { cx } from "class-variance-authority";
import { ComponentPropsWithRef, useSyncExternalStore } from "react";
import { useHydrated } from "~/app/_components/hydration";

type HtmlProps = ComponentPropsWithRef<"html">;

export const Html = ({ className, ...props }: HtmlProps) => {
  const hydrated = useHydrated();

  return (
    <html data-hydrated={hydrated} {...props} className={cx(className, "")} />
  );
};
