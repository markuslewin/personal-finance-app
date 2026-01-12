"use client";

import { cva, cx, type VariantProps } from "class-variance-authority";
import { DropdownMenu } from "radix-ui";
import { type ComponentPropsWithRef } from "react";
import IconEllipsis from "~/app/_assets/icon-ellipsis.svg";

type RootProps = ComponentPropsWithRef<typeof DropdownMenu.Root>;

export const Root = (props: RootProps) => {
  return <DropdownMenu.Root {...props} />;
};

type TriggerProps = ComponentPropsWithRef<typeof DropdownMenu.Trigger>;

export const Trigger = ({ className, ...props }: TriggerProps) => {
  return (
    <DropdownMenu.Trigger
      {...props}
      className={cx(
        className,
        "clickable text-grey-300 transition-colors hocus:text-grey-900",
      )}
    >
      <span className="grid size-200 place-items-center">
        <IconEllipsis className="h-[0.25rem]" />
      </span>
      <span className="sr-only">Actions</span>
    </DropdownMenu.Trigger>
  );
};

type PortalProps = ComponentPropsWithRef<typeof DropdownMenu.Portal>;

export const Portal = (props: PortalProps) => {
  return <DropdownMenu.Portal {...props} />;
};

type ContentProps = ComponentPropsWithRef<typeof DropdownMenu.Content>;

export const Content = ({ className, ...props }: ContentProps) => {
  return (
    <DropdownMenu.Content
      sideOffset={12}
      align="end"
      {...props}
      className={cx(
        className,
        "rounded-lg bg-white text-grey-900 shadow-md forced-colors:border-[0.0625rem]",
      )}
    />
  );
};

const itemVariants = cva(
  "px-250 py-150 -outline-offset-2 outline-grey-900 select-none rounded-lg focus:outline-2",
  {
    variants: {
      intent: { destroy: "text-red" },
    },
  },
);

type ItemProps = ComponentPropsWithRef<typeof DropdownMenu.Item> &
  VariantProps<typeof itemVariants>;

export const Item = ({ className, intent, ...props }: ItemProps) => {
  return (
    <DropdownMenu.Item
      {...props}
      className={itemVariants({ intent, className })}
    />
  );
};

type ItemSeparatorProps = ComponentPropsWithRef<"div">;

export const ItemSeparator = ({ className, ...props }: ItemSeparatorProps) => {
  return (
    <div
      {...props}
      className={cx(className, "mx-250 border-t-[0.0625rem] border-grey-100")}
    />
  );
};
