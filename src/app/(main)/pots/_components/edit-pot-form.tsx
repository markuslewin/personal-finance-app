"use client";

import { type ReactNode } from "react";
import { edit } from "~/app/(main)/pots/_actions";
import { editPotSchema, type EditPotSchema } from "~/app/(main)/pots/_schemas";
import * as Form from "~/app/_components/form";

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
