import { cx } from "class-variance-authority";
import { type ComponentPropsWithRef } from "react";
import * as Select from "~/app/_components/ui/select";

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
    <span className="absolute inset-0 tablet:relative tablet:inset-auto tablet:inline-grid tablet:items-center">
      <select
        {...props}
        className={cx(
          "absolute inset-0 rounded-lg border-[0.0625rem] border-beige-500 bg-white text-grey-900 opacity-0 transition-colors hover:border-grey-500 focus-visible:border-grey-900 tablet:static tablet:inset-auto tablet:col-start-1 tablet:row-start-1 tablet:h-[2.8125rem] tablet:appearance-none tablet:pr-[3.1875rem] tablet:pl-[1.1875rem] tablet:opacity-100",
          className,
        )}
      />
      <Select.Icon className="pointer-events-none col-start-1 row-start-1 mr-250 hidden justify-self-end text-grey-900 tablet:grid" />
    </span>
  );
};
