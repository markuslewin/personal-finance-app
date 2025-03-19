import { cx } from "class-variance-authority";
import { type ComponentPropsWithRef } from "react";

type DialogPageProps = ComponentPropsWithRef<"div">;

const DialogPage = ({ className, ...props }: DialogPageProps) => {
  return (
    <div
      {...props}
      className={cx(
        className,
        "grid grid-cols-[minmax(auto,35rem)] justify-center desktop:justify-start",
      )}
    />
  );
};

export default DialogPage;
