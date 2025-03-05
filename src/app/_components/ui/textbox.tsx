import { cx } from "class-variance-authority";
import { type ComponentPropsWithRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface TextboxProps extends ComponentPropsWithRef<"input"> {}

const Textbox = ({ className, ...props }: TextboxProps) => {
  return (
    <input
      type="text"
      {...props}
      className={cx(
        className,
        "h-[2.8125rem] rounded-lg border-[0.0625rem] border-beige-500 pr-[3.25rem] pl-[1.1875rem] text-grey-900 transition-colors placeholder:text-beige-500 hover:border-grey-500 focus-visible:border-grey-900",
      )}
    />
  );
};

export default Textbox;
