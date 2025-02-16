"use client";

import { type ReactNode } from "react";
import * as Form from "~/app/_components/form";
import { add } from "~/app/budgets/_actions";
import { budgetSchema } from "~/app/budgets/_schemas";

type AddBudgetForm = {
  children: ReactNode;
};

const AddBudgetForm = (props: AddBudgetForm) => {
  return <Form.Root schema={budgetSchema} action={add} {...props} />;
};

export default AddBudgetForm;
