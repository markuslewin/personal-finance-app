import { type ComponentPropsWithRef, useState } from "react";
import { Textbox } from "~/app/_components/form";
import { Hydrated } from "~/app/_components/hydration";
import * as Toggle from "@radix-ui/react-toggle";
import IconHidePassword from "~/app/_assets/icon-hide-password.svg";
import IconShowPassword from "~/app/_assets/icon-show-password.svg";

type PasswordTextboxProps = ComponentPropsWithRef<typeof Textbox>;

export const PasswordTextbox = (props: PasswordTextboxProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative isolate">
      <Textbox
        className="pr-[3.25rem]"
        type={showPassword ? "text" : "password"}
        {...props}
      />
      <Hydrated>
        <Toggle.Root
          className="absolute inset-y-0 right-250 my-auto grid size-200 place-items-center text-grey-900 transition-colors hocus:text-grey-500"
          pressed={showPassword}
          onPressedChange={setShowPassword}
        >
          {showPassword ? (
            <IconHidePassword className="h-[0.75rem]" />
          ) : (
            <IconShowPassword className="h-[0.625rem]" />
          )}
          <span className="sr-only">Show password</span>
        </Toggle.Root>
      </Hydrated>
    </div>
  );
};
