"use client";

import { useEffect } from "react";

const Error = ({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    console.log({ error });
  }, [error]);

  return (
    <>
      <h1 className="text-preset-1">Error</h1>
      <p className="mt-200">{error.message}</p>
    </>
  );
};

export default Error;
