"use client";

import { type ReactNode } from "react";
import * as Form from "~/app/_components/form";
import { addMoney } from "~/app/pots/_actions";
import { type AddMoneySchema, addMoneySchema } from "~/app/pots/_schemas";

type AddMoneyFormProps = {
  children: ReactNode;
  defaultValue: Pick<AddMoneySchema, "id">;
};

const AddMoneyForm = ({ defaultValue, ...props }: AddMoneyFormProps) => {
  return (
    <Form.Root
      schema={addMoneySchema}
      action={addMoney}
      defaultValue={defaultValue}
      {...props}
    />
  );
};

export default AddMoneyForm;
