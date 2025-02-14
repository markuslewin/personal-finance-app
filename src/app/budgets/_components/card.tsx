import { cx } from "class-variance-authority";
import { type ComponentPropsWithRef } from "react";

interface RootProps extends ComponentPropsWithRef<"div"> {}

export const Root = ({ className, ...props }: RootProps) => {
  return (
    <div
      {...props}
      className={cx(
        className,
        "grid max-w-[35rem] gap-250 rounded-xl bg-white px-250 py-300 text-grey-500 tablet:p-400",
      )}
    />
  );
};

interface HeadingProps extends ComponentPropsWithRef<"h1"> {}

export const Heading = ({ className, ...props }: HeadingProps) => {
  return (
    <h1 {...props} className={cx(className, "text-preset-1 text-grey-900")} />
  );
};

interface DescriptionProps extends ComponentPropsWithRef<"p"> {}

export const Description = ({ className, ...props }: DescriptionProps) => {
  return <p {...props} className={cx(className, "")} />;
};

interface FormProps extends ComponentPropsWithRef<"form"> {}

export const Form = ({ className, ...props }: FormProps) => {
  return <form {...props} className={cx(className, "grid gap-250")} />;
};

interface GroupsProps extends ComponentPropsWithRef<"div"> {}

export const Groups = ({ className, ...props }: GroupsProps) => {
  return <div {...props} className={cx(className, "grid gap-250")} />;
};

interface GroupProps extends ComponentPropsWithRef<"div"> {}

export const Group = ({ className, ...props }: GroupProps) => {
  return <div {...props} className={cx(className, "grid gap-50")} />;
};

interface LabelProps extends ComponentPropsWithRef<"label"> {}

export const Label = ({ className, ...props }: LabelProps) => {
  return <label {...props} className={cx(className, "text-preset-5-bold")} />;
};

interface MessageProps extends ComponentPropsWithRef<"p"> {}

export const Message = ({ className, ...props }: MessageProps) => {
  return <p {...props} className={cx(className, "text-end text-preset-5")} />;
};
