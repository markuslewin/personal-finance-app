import { cx } from "class-variance-authority";
import { type ComponentPropsWithRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ComboboxProps extends ComponentPropsWithRef<"select"> {}

const Combobox = ({ className, ...props }: ComboboxProps) => {
  return (
    <select
      {...props}
      className={cx(
        className,
        "h-[2.8125rem] rounded-lg border-[0.0625rem] border-beige-500 bg-white px-250 text-grey-900",
      )}
    />
  );
};

export default Combobox;
