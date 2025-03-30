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
      <p className="mt-200">Something went wrong! Please try again.</p>
    </>
  );
};

export default Error;
