type ErrorPageProps = {
  message: string;
};

export const ErrorPage = ({ message }: ErrorPageProps) => {
  return (
    <>
      <h1 className="text-preset-1">Error</h1>
      <p className="mt-200">{message}</p>
    </>
  );
};
