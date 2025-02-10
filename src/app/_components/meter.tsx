import { cx } from "class-variance-authority";
import { useId, type ComponentPropsWithRef } from "react";

interface RootProps extends ComponentPropsWithRef<"span"> {
  name: string;
  min: number;
  max: number;
  value: number;
}

export const Root = ({
  className,
  name,
  max,
  min,
  value,
  ...props
}: RootProps) => {
  const labelId = useId();
  return (
    <>
      <span className="sr-only" id={labelId}>
        {name}
      </span>
      <span
        role="meter"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-labelledby={labelId}
        {...props}
        className={cx(className, "")}
      />
    </>
  );
};

type IndicatorProps = ComponentPropsWithRef<"span">;

export const Indicator = ({ className, ...props }: IndicatorProps) => {
  return <span {...props} className={cx(className, "")} />;
};
