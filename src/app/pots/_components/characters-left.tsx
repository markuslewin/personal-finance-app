"use client";

import { useField } from "@conform-to/react";
import { NAME_MAX_LENGTH } from "~/app/pots/_schemas";

type CharactersLeftProps = {
  name: string;
};

const CharactersLeft = ({ name }: CharactersLeftProps) => {
  const [meta] = useField(name);

  const length = typeof meta.value === "string" ? meta.value.length : 0;

  return <>{Math.max(0, NAME_MAX_LENGTH - length)}</>;
};

export default CharactersLeft;
