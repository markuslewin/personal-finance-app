import { cx } from "class-variance-authority";
import { Slot } from "radix-ui";
import { type ComponentPropsWithRef } from "react";
import IconCloseModal from "~/app/_assets/icon-close-modal.svg";

type OverlayProps = ComponentPropsWithRef<"div">;

export const Overlay = ({ className, ...props }: OverlayProps) => {
  return (
    <div
      {...props}
      className={cx(
        className,
        "fixed inset-0 grid grid-cols-[minmax(auto,35rem)] items-center justify-center overflow-y-auto bg-[hsl(0_0%_0%/0.5)] p-250",
      )}
    />
  );
};

type ContentProps = ComponentPropsWithRef<"div"> & {
  asChild?: boolean;
};

export const Content = ({
  className,
  asChild = false,
  ...props
}: ContentProps) => {
  const Comp = asChild ? Slot.Root : "div";

  return (
    <Comp
      {...props}
      className={cx(
        className,
        "grid gap-250 rounded-xl bg-white px-250 py-300 text-grey-500 tablet:p-400 forced-colors:border-[0.0625rem]",
      )}
    />
  );
};

type HeaderProps = ComponentPropsWithRef<"header">;

export const Header = ({ className, ...props }: HeaderProps) => {
  return (
    <header
      {...props}
      className={cx(
        className,
        "grid grid-cols-[1fr_auto] items-center gap-200",
      )}
    />
  );
};

type HeadingProps = ComponentPropsWithRef<"h1"> & {
  asChild?: boolean;
};

export const Heading = ({
  className,
  asChild = false,
  ...props
}: HeadingProps) => {
  const Comp = asChild ? Slot.Root : "h1";

  return (
    <Comp
      {...props}
      className={cx(
        className,
        "text-preset-2 [overflow-wrap:anywhere] text-grey-900 tablet:text-preset-1",
      )}
    />
  );
};

type CloseProps = ComponentPropsWithRef<"button">;

export const Close = ({ className, ...props }: CloseProps) => {
  return (
    <button
      {...props}
      className={cx(
        className,
        "clickable rounded-full transition-colors hocus:text-grey-900",
      )}
    >
      <IconCloseModal className="h-[1.625rem]" />
      <span className="sr-only">Close</span>
    </button>
  );
};

type DescriptionProps = ComponentPropsWithRef<"p">;

export const Description = ({ className, ...props }: DescriptionProps) => {
  return <p {...props} className={cx(className, "")} />;
};
