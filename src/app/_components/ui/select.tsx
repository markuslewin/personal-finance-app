import { type ComponentPropsWithRef } from "react";
import * as Select from "@radix-ui/react-select";
import IconCaretDown from "~/app/_assets/icon-caret-down.svg";
import IconSelected from "~/app/_assets/icon-selected.svg";
import { cx } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

export const Root = Select.Root;

type TriggerProps = ComponentPropsWithRef<typeof Select.Trigger>;

export const Trigger = ({ className, ...props }: TriggerProps) => {
  return (
    <Select.Trigger
      {...props}
      className={cx(className, "group select-trigger")}
    />
  );
};

export const Value = Select.Value;

type IconProps = ComponentPropsWithRef<typeof Select.Icon>;

export const Icon = ({ className, ...props }: IconProps) => {
  return (
    <Select.Icon
      {...props}
      className={twMerge(cx("grid size-200 place-items-center", className))}
    >
      <IconCaretDown className="h-[0.375rem] transition-transform group-data-[state=open]:rotate-180" />
    </Select.Icon>
  );
};

export const Portal = Select.Portal;

type ContentProps = ComponentPropsWithRef<typeof Select.Content>;

export const Content = ({ className, children, ...props }: ContentProps) => {
  return (
    <Select.Content
      className={cx(
        className,
        "max-h-[var(--radix-select-content-available-height)] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg bg-white text-grey-900 shadow-md forced-colors:border-[0.0625rem]",
      )}
      position="popper"
      sideOffset={16}
      align="end"
      {...props}
    >
      <Select.Viewport>{children}</Select.Viewport>
    </Select.Content>
  );
};

export const Group = Select.Group;

export const Label = Select.Label;

type SeparatorProps = ComponentPropsWithRef<typeof Select.Separator>;

export const Separator = ({ className, ...props }: SeparatorProps) => {
  return (
    <Select.Separator {...props} className={cx(className, "px-250")}>
      <div className="border-t-[0.0625rem] border-grey-100" />
    </Select.Separator>
  );
};

type ItemProps = ComponentPropsWithRef<typeof Select.Item>;

export const Item = ({ className, ...props }: ItemProps) => {
  return (
    <Select.Item
      {...props}
      className={cx(
        className,
        "grid items-center rounded-lg px-250 py-150 -outline-offset-2 select-none data-[disabled]:pointer-events-none data-[state=checked]:text-preset-4-bold",
      )}
    />
  );
};

type ColorItemProps = ComponentPropsWithRef<typeof Select.Item>;

export const ColorItem = ({ className, ...props }: ColorItemProps) => {
  return (
    <Select.Item
      {...props}
      className={cx(
        className,
        "grid grid-cols-[1fr_auto] items-center gap-200 rounded-lg px-250 py-150 -outline-offset-2 select-none data-[disabled]:pointer-events-none",
      )}
    />
  );
};

export const ItemText = Select.ItemText;

type ItemIndicatorProps = ComponentPropsWithRef<typeof Select.ItemIndicator>;

export const ItemIndicator = ({ className, ...props }: ItemIndicatorProps) => {
  return (
    <Select.ItemIndicator {...props} className={cx(className, "text-green")}>
      <IconSelected className="h-[0.875rem]" />
    </Select.ItemIndicator>
  );
};
