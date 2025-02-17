"use client";

import { type ReactNode } from "react";
import * as Form from "~/app/_components/form";
import { remove } from "~/app/budgets/_actions";
import { budgetIdSchema } from "~/app/budgets/_schemas";

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
