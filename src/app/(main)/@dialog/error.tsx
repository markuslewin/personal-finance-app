"use client";

import { useEffect } from "react";
import { ErrorDialog } from "~/app/(main)/@dialog/_components/error-dialog";

const Error = ({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    console.log({ error });
  }, [error]);

  return <ErrorDialog message="Something went wrong! Please try again." />;
};

export default Error;
