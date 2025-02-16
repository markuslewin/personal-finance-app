import { Slot } from "@radix-ui/react-slot";
import { cx } from "class-variance-authority";
import { type ComponentPropsWithRef } from "react";
import IconCloseModal from "~/app/_assets/icon-close-modal.svg";

type RootProps = ComponentPropsWithRef<"div"> & {
  asChild?: boolean;
};

export const Root = ({ className, asChild = false, ...props }: RootProps) => {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      {...props}
      className={cx(
        className,
        "grid max-w-[35rem] gap-250 rounded-xl bg-white px-250 py-300 text-grey-500 tablet:p-400",
      )}
    />
  );
};

type HeaderProps = ComponentPropsWithRef<"header">;

export const Header = ({ className, ...props }: HeaderProps) => {
  return (
    <header
      {...props}
      className={cx(className, "flex flex-wrap items-center justify-between")}
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
  const Comp = asChild ? Slot : "h1";

  return (
    <Comp {...props} className={cx(className, "text-preset-1 text-grey-900")} />
  );
};

type CloseProps = ComponentPropsWithRef<"button">;

export const Close = ({ className, ...props }: CloseProps) => {
  return (
    <button
      {...props}
      className={cx(
        className,
        "rounded-full transition-colors hocus:text-grey-900",
      )}
    >
      <IconCloseModal />
      <span className="sr-only">Close</span>
    </button>
  );
};

type DescriptionProps = ComponentPropsWithRef<"p">;

export const Description = ({ className, ...props }: DescriptionProps) => {
  return <p {...props} className={cx(className, "")} />;
};

type FormProps = ComponentPropsWithRef<"form">;

export const Form = ({ className, ...props }: FormProps) => {
  return <form {...props} className={cx(className, "grid gap-250")} />;
};

type GroupsProps = ComponentPropsWithRef<"div">;

export const Groups = ({ className, ...props }: GroupsProps) => {
  return <div {...props} className={cx(className, "grid gap-200")} />;
};

type GroupProps = ComponentPropsWithRef<"div">;

export const Group = ({ className, ...props }: GroupProps) => {
  return <div {...props} className={cx(className, "grid gap-50")} />;
};

type LabelProps = ComponentPropsWithRef<"label">;

export const Label = ({ className, ...props }: LabelProps) => {
  return <label {...props} className={cx(className, "text-preset-5-bold")} />;
};

type MessageProps = ComponentPropsWithRef<"p">;

export const Message = ({ className, ...props }: MessageProps) => {
  return <p {...props} className={cx(className, "text-end text-preset-5")} />;
};
