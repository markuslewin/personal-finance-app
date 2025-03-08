// todo: Merge into Hydrated Combobox

import { type ComponentPropsWithRef } from "react";
import * as Select from "@radix-ui/react-select";
import IconCaretDown from "~/app/_assets/icon-caret-down.svg";
import IconSelected from "~/app/_assets/icon-selected.svg";

type RootProps = ComponentPropsWithRef<typeof Select.Root>;

export const Root = ({ className, children, ...props }: RootProps) => {
  return (
    <Select.Root>
      <Select.Trigger
        className="grid h-[2.8125rem] grid-cols-[1fr_auto] items-center rounded-lg border-[0.0625rem] border-beige-500 bg-white px-[1.1875rem] text-start text-grey-900 transition-colors hover:border-grey-500 focus-visible:border-grey-900"
        aria-label="Food"
      >
        <Select.Value placeholder="Select a fruit…" />
        <Select.Icon className="grid size-200 place-items-center">
          <IconCaretDown />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          className="min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg bg-white shadow"
          position="popper"
          sideOffset={16}
        >
          <Select.Viewport>
            {[
              { name: "Green", color: "var(--color-green)" },
              { name: "Yellow", color: "var(--color-yellow)" },
              { name: "Cyan", color: "var(--color-cyan)" },
              { name: "Navy", color: "var(--color-navy)" },
              { name: "Red", color: "var(--color-red)" },
              { name: "Purple", color: "var(--color-purple)" },
              { name: "Turquoise", color: "var(--color-turquoise)" },
              { name: "Brown", color: "var(--color-brown)" },
              { name: "Magenta", color: "var(--color-magenta)" },
              { name: "Blue", color: "var(--color-blue)" },
              { name: "Navy Grey", color: "var(--color-navy-grey)" },
              { name: "Army Green", color: "var(--color-army-green)" },
              { name: "Pink", color: "var(--color-pink)" },
              { name: "Gold", color: "var(--color-gold)" },
              { name: "Orange", color: "var(--color-orange)" },
            ].map((theme) => {
              return (
                <Select.Item
                  className={
                    "grid grid-cols-[1fr_auto] items-center rounded-lg px-250 py-150 -outline-offset-2 select-none data-[disabled]:pointer-events-none"
                  }
                  key={theme.name}
                  value={theme.name}
                >
                  <Select.ItemText>
                    <span
                      className="mr-150 inline-block size-200 translate-y-[0.1875rem] rounded-full"
                      style={{ background: theme.color }}
                    />
                    {theme.name}
                  </Select.ItemText>
                  <Select.ItemIndicator className="text-green">
                    <IconSelected />
                  </Select.ItemIndicator>
                </Select.Item>
              );
            })}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};
