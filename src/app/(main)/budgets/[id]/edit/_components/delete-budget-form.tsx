"use client";

import { type ReactNode } from "react";
import { remove } from "~/app/(main)/budgets/_utils/actions";
import { budgetIdSchema } from "~/app/(main)/budgets/_utils/schemas";
import * as Form from "~/app/_components/form";

type DeleteBudgetFormProps = {
  children: ReactNode;
  id: string;
};

const DeleteBudgetForm = ({ id, ...props }: DeleteBudgetFormProps) => {
  return (
    <Form.Root
      schema={budgetIdSchema}
      action={remove}
      defaultValue={{ id }}
      {...props}
    />
  );
};

export default DeleteBudgetForm;
