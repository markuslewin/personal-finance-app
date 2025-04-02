"use client";

import { type ReactNode } from "react";
import { type FormStatus as FormStatusType, useFormStatus } from "react-dom";

// `FormStatus` enables access to the form status in a Client Component, without having to create a new Client Component.
// `Idle` and `Pending` enable access to the `pending` state of a form status, without having to create a new Client Component.

type FormStatusProps = {
  children: (formStatus: FormStatusType) => ReactNode;
};

export const FormStatus = ({ children }: FormStatusProps) => {
  return children(useFormStatus());
};

type IdleProps = {
  children: ReactNode;
};

export const Idle = ({ children }: IdleProps) => {
  return (
    <FormStatus>
      {(status) => {
        return !status.pending ? children : null;
      }}
    </FormStatus>
  );
};

type PendingProps = {
  children: ReactNode;
};

export const Pending = ({ children }: PendingProps) => {
  return (
    <FormStatus>
      {(status) => {
        return status.pending ? children : null;
      }}
    </FormStatus>
  );
};
