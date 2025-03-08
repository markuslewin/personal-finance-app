import { cx } from "class-variance-authority";
import { type ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";
import { Dehydrated, Hydrated } from "~/app/_components/hydration";
import * as Select from "~/app/_components/ui/select";

type ComboboxProps = ComponentPropsWithRef<"select">;

const Combobox = ({ className, ...props }: ComboboxProps) => {
  return (
    <>
      <Dehydrated>
        <select
          {...props}
          className={twMerge(
            cx(
              "h-[2.8125rem] rounded-lg border-[0.0625rem] border-beige-500 bg-white px-[1.1875rem] text-grey-900 transition-colors hover:border-grey-500 focus-visible:border-grey-900",
              className,
            ),
          )}
        />
      </Dehydrated>
      <Hydrated>
        <Select.Root
          {...props}
          className={twMerge(
            cx(
              "h-[2.8125rem] rounded-lg border-[0.0625rem] border-beige-500 bg-white px-[1.1875rem] text-grey-900 transition-colors hover:border-grey-500 focus-visible:border-grey-900",
              className,
            ),
          )}
        />
      </Hydrated>
    </>
  );
};

export default Combobox;
