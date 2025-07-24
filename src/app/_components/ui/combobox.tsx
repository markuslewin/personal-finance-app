import { cx } from "class-variance-authority";
import { type ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";
import * as Select from "~/app/_components/ui/select";

type ComboboxProps = ComponentPropsWithRef<"select">;

const Combobox = ({ className, ...props }: ComboboxProps) => {
  return (
    <span className="relative inline-grid items-center">
      <select
        {...props}
        className={twMerge(
          cx(
            "col-start-1 row-start-1 h-[2.8125rem] appearance-none rounded-lg border-[0.0625rem] border-beige-500 bg-white pr-[3.1875rem] pl-[1.1875rem] text-grey-900 transition-colors hover:border-grey-500 focus-visible:border-grey-900",
            className,
          ),
        )}
      />
      <Select.Icon className="pointer-events-none col-start-1 row-start-1 mr-250 justify-self-end text-grey-900" />
    </span>
  );
};

export default Combobox;
