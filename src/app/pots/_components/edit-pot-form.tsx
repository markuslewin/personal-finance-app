"use client";

import { type ReactNode } from "react";
import * as Form from "~/app/_components/form";
import { edit } from "~/app/pots/_actions";
import { editPotSchema, type EditPotSchema } from "~/app/pots/_schemas";

type EditPotFormProps = {
  children: ReactNode;
  defaultValue: EditPotSchema;
};

const EditPotForm = ({ defaultValue, ...props }: EditPotFormProps) => {
  return (
    <Form.Root
      schema={editPotSchema}
      action={edit}
      defaultValue={defaultValue}
      {...props}
    />
  );
};

export default EditPotForm;
