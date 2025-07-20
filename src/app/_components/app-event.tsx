"use client";

import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useState,
} from "react";

export type AppEvent =
  | { type: "budgets:focus-add-new-budget" }
  | { type: "edit-budget"; data: { id: string } }
  | { type: "created-budget"; data: { id: string } };

const AppEventContext = createContext<{
  appEvent: AppEvent | null;
  setAppEvent: Dispatch<SetStateAction<AppEvent | null>>;
} | null>(null);

type AppEventProviderProps = {
  children: ReactNode;
};

export const AppEventProvider = (props: AppEventProviderProps) => {
  const [appEvent, setAppEvent] = useState<AppEvent | null>(null);

  return (
    <AppEventContext.Provider
      value={{
        appEvent,
        setAppEvent,
      }}
      {...props}
    />
  );
};

export const useAppEvent = () => {
  const value = useContext(AppEventContext);
  if (value === null) {
    throw new Error("`useAppEvent` must be used inside of `AppEventProvider`");
  }
  return value;
};
