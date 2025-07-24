import { type ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface TextboxProps extends ComponentPropsWithRef<"input"> {}

const Textbox = ({ className, ...props }: TextboxProps) => {
  return (
    <input
      type="text"
      {...props}
      className={twMerge(
        "h-[2.8125rem] w-full rounded-lg border-[0.0625rem] border-beige-500 px-[1.1875rem] text-grey-900 transition-colors placeholder:text-beige-500 hover:border-grey-500 focus-visible:border-grey-900",
        className,
      )}
    />
  );
};

export default Textbox;
