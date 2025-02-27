import { cx } from "class-variance-authority";
import { type ComponentPropsWithRef } from "react";

type RootProps = ComponentPropsWithRef<"label">;

export const Root = ({ className, ...props }: RootProps) => {
  return <label {...props} className={cx(className, "relative")} />;
};

type NameProps = ComponentPropsWithRef<"span">;

export const Name = ({ className, ...props }: NameProps) => {
  return (
    <span {...props} className={cx(className, "sr-only tablet:not-sr-only")} />
  );
};

type ComboboxProps = ComponentPropsWithRef<"select">;

export const Control = ({ className, ...props }: ComboboxProps) => {
  return (
    <select
      {...props}
      className={cx(
        "absolute inset-0 rounded-lg border-[0.0625rem] border-beige-500 bg-white px-[1.1875rem] text-grey-900 opacity-0 transition-colors hover:border-grey-500 focus-visible:border-grey-900 tablet:static tablet:inset-auto tablet:h-[2.8125rem] tablet:opacity-100",
        className,
      )}
    />
  );
};
