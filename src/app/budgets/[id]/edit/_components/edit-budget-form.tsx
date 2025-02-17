"use client";

import { type ReactNode } from "react";
import * as Form from "~/app/_components/form";
import { edit } from "~/app/budgets/_actions";
import {
  type BudgetSchemaWithId,
  budgetSchemaWithId,
} from "~/app/budgets/_schemas";

type EditBudgetFormProps = {
  children: ReactNode;
  budget: BudgetSchemaWithId;
};

const EditBudgetForm = ({ budget, ...props }: EditBudgetFormProps) => {
  return (
    <Form.Root
      schema={budgetSchemaWithId}
      action={edit}
      defaultValue={budget}
      {...props}
    />
  );
};

export default EditBudgetForm;
