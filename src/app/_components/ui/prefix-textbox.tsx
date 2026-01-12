import { Slot } from "radix-ui";
import { type ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";

type RootProps = ComponentPropsWithRef<"span">;

export const Root = ({ className, ...props }: RootProps) => {
  return (
    <span
      className={twMerge("inline-grid items-center", className)}
      {...props}
    />
  );
};

type PrefixProps = ComponentPropsWithRef<"span">;

export const Prefix = ({ className, ...props }: PrefixProps) => {
  return (
    <span
      className={twMerge(
        "pointer-events-none col-start-1 row-start-1 ml-250 justify-self-start text-preset-4 text-beige-500",
        className,
      )}
      aria-hidden="true"
      {...props}
    />
  );
};

type InputProps = ComponentPropsWithRef<"input"> & {
  asChild?: boolean;
};

export const Input = ({ className, asChild = false, ...props }: InputProps) => {
  const Comp = asChild ? Slot.Root : "input";

  return (
    <Comp
      className={twMerge("col-start-1 row-start-1 pl-[2.5625rem]", className)}
      {...props}
    />
  );
};
