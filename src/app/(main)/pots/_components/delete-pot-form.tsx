"use client";

import { type ReactNode } from "react";
import * as Form from "~/app/_components/form";
import { remove } from "~/app/(main)/pots/_utils/actions";
import { removePotSchema } from "~/app/(main)/pots/_utils/schemas";

type DeletePotFormProps = {
  children: ReactNode;
  id: string;
};

const DeletePotForm = ({ id, ...props }: DeletePotFormProps) => {
  return (
    <Form.Root
      schema={removePotSchema}
      action={remove}
      defaultValue={{ id }}
      {...props}
    />
  );
};

export default DeletePotForm;
