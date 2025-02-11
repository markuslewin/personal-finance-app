import * as Slot from "@radix-ui/react-slot";
import { cx } from "class-variance-authority";
import { type ComponentPropsWithRef } from "react";

interface ButtonProps extends ComponentPropsWithRef<"button"> {
  asChild?: boolean;
}

const Button = ({ className, asChild = false, ...props }: ButtonProps) => {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      {...props}
      className={cx(
        className,
        "rounded-lg bg-grey-900 p-200 text-preset-4-bold text-white transition-colors hocus:bg-grey-500",
      )}
    />
  );
};

export default Button;
