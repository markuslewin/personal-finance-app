"use client";

import { type ReactNode } from "react";
import * as Form from "~/app/_components/form";
import { add } from "~/app/pots/_actions";
import { type PotSchema, potSchema } from "~/app/pots/_schemas";

type AddPotFormProps = {
  children: ReactNode;
  defaultValue: Pick<PotSchema, "theme">;
};

const AddPotForm = (props: AddPotFormProps) => {
  return <Form.Root schema={potSchema} action={add} {...props} />;
};

export default AddPotForm;
