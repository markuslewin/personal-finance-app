import { UpdateIcon } from "@radix-ui/react-icons";
import { cx } from "class-variance-authority";
import { type ComponentPropsWithRef } from "react";

type SpinnerProps = ComponentPropsWithRef<typeof UpdateIcon>;

const Spinner = ({ className, ...props }: SpinnerProps) => {
  return (
    <UpdateIcon
      focusable="false"
      aria-hidden="true"
      {...props}
      className={cx(className, "inline-block size-[0.9375rem] animate-spin")}
    />
  );
};

export default Spinner;
