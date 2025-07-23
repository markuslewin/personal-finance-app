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
    <div className="gap-400 rounded-xl bg-white px-250 py-300 text-grey-500 tablet:p-400 forced-colors:border-[0.0625rem]">
      <h1 className="text-preset-1 text-grey-900">Error</h1>
      <p className="mt-200">Something went wrong! Please try again.</p>
    </div>
  );
};

export default Error;
