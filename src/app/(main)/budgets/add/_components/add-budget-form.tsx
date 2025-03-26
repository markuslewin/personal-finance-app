"use client";

import { type ReactNode } from "react";
import * as Form from "~/app/_components/form";
import { add } from "~/app/(main)/budgets/_actions";
import { type BudgetSchema, budgetSchema } from "~/app/(main)/budgets/_schemas";

type AddBudgetFormProps = {
  children: ReactNode;
  defaultValue: Pick<BudgetSchema, "category" | "theme">;
};

const AddBudgetForm = (props: AddBudgetFormProps) => {
  return <Form.Root schema={budgetSchema} action={add} {...props} />;
};

export default AddBudgetForm;
