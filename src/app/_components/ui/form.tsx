import { cx } from "class-variance-authority";
import { type ComponentPropsWithRef } from "react";

type RootProps = ComponentPropsWithRef<"form">;

export const Root = ({ className, ...props }: RootProps) => {
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
