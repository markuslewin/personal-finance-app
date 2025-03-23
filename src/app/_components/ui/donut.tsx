import { cx } from "class-variance-authority";
import { type ComponentPropsWithRef } from "react";

interface DataItem {
  color: string;
  percent: number;
}

interface DonutProps extends ComponentPropsWithRef<"div"> {
  data: DataItem[];
}

export const Root = ({ className, data, ...props }: DonutProps) => {
  const [first, ...rest] = data;

  return (
    <div
      {...props}
      className={cx(
        className,
        "mx-auto grid size-[15rem] place-items-center rounded-full bg-grey-500 forced-color-adjust-none",
      )}
      style={{
        background:
          first !== undefined
            ? `conic-gradient(${
                rest.reduce(
                  (last, current) => {
                    const end = last.end + current.percent;
                    return {
                      end,
                      string: `${last.string}, ${current.color} ${last.end}turn, ${current.color} ${end}turn`,
                    };
                  },
                  {
                    end: first.percent,
                    string: `${first.color} ${first.percent}turn`,
                  },
                ).string
              })`
            : undefined,
      }}
    />
  );
};

type HoleProps = ComponentPropsWithRef<"div">;

export const Hole = ({ className, ...props }: HoleProps) => {
  return (
    <div
      {...props}
      className={cx(
        className,
        "grid size-[67.5%] items-center rounded-full bg-white text-center text-preset-5 text-grey-500 shadow-[0_0_0_0.8125rem_hsl(0_0%_100%/0.25)] forced-color-adjust-auto",
      )}
    />
  );
};
