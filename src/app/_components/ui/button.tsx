import * as Slot from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentPropsWithRef } from "react";

const buttonVariants = cva("transition-colors", {
  variants: {
    intent: {
      primary:
        "bg-grey-900 text-white hocus:bg-grey-500 p-200 text-preset-4-bold rounded-lg forced-colors:border-[0.0625rem]",
      tertiary: "text-grey-500 hocus:text-grey-900 text-preset-4",
      destroy:
        "bg-red text-white hocus:bg-[hsl(7_58%_60%)] p-200 text-preset-4-bold rounded-lg forced-colors:border-[0.0625rem]",
    },
  },
  defaultVariants: {
    intent: "primary",
  },
});

type ButtonProps = ComponentPropsWithRef<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

const Button = ({
  className,
  intent,
  asChild = false,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot.Root : "button";

  return <Comp {...props} className={buttonVariants({ className, intent })} />;
};

export default Button;
