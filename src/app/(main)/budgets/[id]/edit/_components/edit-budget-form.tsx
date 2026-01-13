"use client";

import { type ReactNode } from "react";
import { edit } from "~/app/(main)/budgets/_actions";
import {
  type EditBudget,
  editBudgetSchema,
} from "~/app/(main)/budgets/_schemas";
import * as Form from "~/app/_components/form";

type EditBudgetFormProps = {
  children: ReactNode;
  defaultValue: EditBudget;
};

const EditBudgetForm = ({ defaultValue, ...props }: EditBudgetFormProps) => {
  return (
    <Form.Root
      schema={editBudgetSchema}
      action={edit}
      defaultValue={defaultValue}
      {...props}
    />
  );
};

export default EditBudgetForm;
