"use client";

// https://github.com/sergiodxa/remix-utils/blob/main/src/react/use-hydrated.ts

import { type ReactNode, useSyncExternalStore } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const subscribe = () => () => {};

const useHydrated = () => {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
};

type HydratedProps = {
  children: ReactNode;
};

export const Hydrated = ({ children }: HydratedProps) => {
  const isHydrated = useHydrated();

  return isHydrated ? children : null;
};

type DehydratedProps = {
  children: ReactNode;
};

export const Dehydrated = ({ children }: DehydratedProps) => {
  const isHydrated = useHydrated();

  return !isHydrated ? children : null;
};
