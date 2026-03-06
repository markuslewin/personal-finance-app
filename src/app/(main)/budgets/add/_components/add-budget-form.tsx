"use client";

import { type ReactNode } from "react";
import { add } from "~/app/(main)/budgets/_utils/actions";
import {
  type BudgetSchema,
  budgetSchema,
} from "~/app/(main)/budgets/_utils/schemas";
import * as Form from "~/app/_components/form";

type AddBudgetFormProps = {
  children: ReactNode;
  defaultValue: Pick<BudgetSchema, "category" | "theme">;
};

const AddBudgetForm = (props: AddBudgetFormProps) => {
  return <Form.Root schema={budgetSchema} action={add} {...props} />;
};

export default AddBudgetForm;
