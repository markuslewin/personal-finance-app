"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.log({ error });
  }, [error]);

  return (
    <html>
      <body className="min-h-screen bg-beige-100 px-200 py-300 font-public-sans text-preset-4 text-grey-900 tablet:p-500">
        <h1 className="text-preset-1">Error</h1>
        <p className="mt-200">Something went wrong! Please try again.</p>
      </body>
    </html>
  );
}
