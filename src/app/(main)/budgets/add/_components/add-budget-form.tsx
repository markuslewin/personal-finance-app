"use client";

import { type ReactNode } from "react";
import * as Form from "~/app/_components/form";
import { dehydratedAdd, hydratedAdd } from "~/app/(main)/budgets/_actions";
import { type BudgetSchema, budgetSchema } from "~/app/(main)/budgets/_schemas";
import { useRouter } from "next/navigation";
import { useAppEvent } from "~/app/_components/app-event";

type AddBudgetFormProps = {
  children: ReactNode;
  defaultValue: Pick<BudgetSchema, "category" | "theme">;
};

const AddBudgetForm = (props: AddBudgetFormProps) => {
  const router = useRouter();
  const { setAppEvent } = useAppEvent();

  return (
    <Form.Root
      schema={budgetSchema}
      dehydratedAction={dehydratedAdd}
      hydratedAction={hydratedAdd}
      onSuccess={(data) => {
        router.push(data.redirect);
        setAppEvent({ type: "created-budget", data: data.budget });
      }}
      {...props}
    />
  );
};

export default AddBudgetForm;
