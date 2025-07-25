"use client";

import { useEffect } from "react";
import { ErrorPage } from "~/app/(main)/_components/error-page";

const Error = ({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    console.log({ error });
  }, [error]);

  return <ErrorPage message="Something went wrong! Please try again." />;
};

export default Error;
