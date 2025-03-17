import { type ComponentPropsWithRef } from "react";
import * as Select from "@radix-ui/react-select";
import IconCaretDown from "~/app/_assets/icon-caret-down.svg";
import IconSelected from "~/app/_assets/icon-selected.svg";
import { cx } from "class-variance-authority";

export const Root = Select.Root;

type TriggerProps = ComponentPropsWithRef<typeof Select.Trigger>;

export const Trigger = ({ className, ...props }: TriggerProps) => {
  return (
    <Select.Trigger
      {...props}
      className={cx(
        className,
        "group grid h-[2.8125rem] grid-cols-[1fr_auto] items-center rounded-lg border-[0.0625rem] border-beige-500 bg-white px-[1.1875rem] text-start text-grey-900 transition-colors hover:border-grey-500 focus-visible:border-grey-900",
      )}
    >
      <Select.Value />
      <Select.Icon className="grid size-200 place-items-center">
        <IconCaretDown className="transition-transform group-data-[state=open]:rotate-180" />
      </Select.Icon>
    </Select.Trigger>
  );
};

export const Portal = Select.Portal;

type ContentProps = ComponentPropsWithRef<typeof Select.Content>;

export const Content = ({ className, children, ...props }: ContentProps) => {
  return (
    <Select.Content
      className={cx(
        className,
        "min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg bg-white shadow",
      )}
      position="popper"
      sideOffset={16}
      {...props}
    >
      <Select.Viewport>{children}</Select.Viewport>
    </Select.Content>
  );
};

type ItemProps = ComponentPropsWithRef<typeof Select.Item>;

export const Item = ({ className, ...props }: ItemProps) => {
  return (
    <Select.Item
      {...props}
      className={cx(
        className,
        "grid grid-cols-[1fr_auto] items-center rounded-lg px-250 py-150 -outline-offset-2 select-none data-[disabled]:pointer-events-none",
      )}
    />
  );
};

export const ItemText = Select.ItemText;

type ItemIndicatorProps = ComponentPropsWithRef<typeof Select.ItemIndicator>;

export const ItemIndicator = ({ className, ...props }: ItemIndicatorProps) => {
  return (
    <Select.ItemIndicator {...props} className={cx(className, "text-green")}>
      <IconSelected />
    </Select.ItemIndicator>
  );
};
