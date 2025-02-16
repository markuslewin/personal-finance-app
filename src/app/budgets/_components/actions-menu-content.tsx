"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cx } from "class-variance-authority";
import { useRouter } from "next/navigation";
import { type ComponentPropsWithRef } from "react";

interface ActionsMenuContentProps
  extends ComponentPropsWithRef<typeof DropdownMenu.Content> {
  id: string;
}

const ActionsMenuContent = ({
  className,
  id,
  ...props
}: ActionsMenuContentProps) => {
  const router = useRouter();

  return (
    <DropdownMenu.Content
      className={cx(
        className,
        "rounded-lg bg-white text-grey-900 shadow-[0_0.25rem_1.5rem_hsl(0_0%_0%/0.25)]",
      )}
      sideOffset={12}
      align="end"
      {...props}
    >
      <DropdownMenu.Item
        className="px-250 py-150"
        onSelect={() => {
          router.push(`/budgets/${id}/edit`);
        }}
      >
        Edit Budget
      </DropdownMenu.Item>
      <div className="mx-250 border-t-[0.0625rem] border-grey-100" />
      <DropdownMenu.Item
        className="px-250 py-150 text-red"
        onSelect={() => {
          console.log("todo: Delete");
        }}
      >
        Delete Budget
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  );
};

export default ActionsMenuContent;
