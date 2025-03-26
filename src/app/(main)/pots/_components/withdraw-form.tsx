"use client";

import { type ReactNode } from "react";
import * as Form from "~/app/_components/form";
import { withdraw } from "~/app/(main)/pots/_actions";
import {
  withdrawSchema,
  type WithdrawSchema,
} from "~/app/(main)/pots/_schemas";

type WithdrawFormProps = {
  children: ReactNode;
  defaultValue: Pick<WithdrawSchema, "id">;
};

const WithdrawForm = ({ defaultValue, ...props }: WithdrawFormProps) => {
  return (
    <Form.Root
      schema={withdrawSchema}
      action={withdraw}
      defaultValue={defaultValue}
      {...props}
    />
  );
};

export default WithdrawForm;
