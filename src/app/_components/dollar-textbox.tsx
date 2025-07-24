"use client";

import { useField } from "@conform-to/react";
import { type ComponentPropsWithRef } from "react";
import { Textbox } from "~/app/_components/form";
import * as PrefixTextbox from "~/app/_components/ui/prefix-textbox";

type DollarTextboxProps = ComponentPropsWithRef<typeof Textbox>;

export const DollarTextbox = (props: DollarTextboxProps) => {
  const [meta] = useField(props.name);

  return (
    <>
      <PrefixTextbox.Root>
        <PrefixTextbox.Input asChild>
          <Textbox {...props} />
        </PrefixTextbox.Input>
        <PrefixTextbox.Prefix>$</PrefixTextbox.Prefix>
      </PrefixTextbox.Root>
      <p className="sr-only" id={meta.descriptionId}>
        In dollars
      </p>
    </>
  );
};
