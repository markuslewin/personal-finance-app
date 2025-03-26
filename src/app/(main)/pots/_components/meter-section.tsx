"use client";

import * as Meter from "~/app/_components/meter";
import { useField } from "@conform-to/react";
import { currency, percent } from "~/app/_format";
import { cx } from "class-variance-authority";
import { amount as amountSchema } from "~/app/(main)/pots/_schemas";
import { useId } from "react";

type MeterSectionProps = {
  name: string;
  total: number;
  target: number;
};

// todo: Merge with `WithdrawMeterSection`
const MeterSection = ({ name, total, target }: MeterSectionProps) => {
  const labelId = useId();
  const [meta] = useField(name);

  const amount = amountSchema.catch(0).parse(Number(meta.value));
  const clampedAmount = Math.min(target - total, amount);
  const nextTotal = total + amount;
  const clampedNextTotal = Math.min(target, nextTotal);

  const greyPercent = total / clampedNextTotal;
  const greenPercent = clampedAmount / clampedNextTotal;

  return (
    <div>
      <p className="flex flex-wrap items-center justify-between">
        <span>
          <span id={labelId}>New Amount</span>
          <span className="sr-only">: </span>
        </span>
        <span className="text-preset-1 text-grey-900">
          {currency(nextTotal)}
        </span>
      </p>
      <p className="mt-200">
        <Meter.Root
          className="grid h-100 rounded-full bg-beige-100 forced-colors:border-[0.0625rem] forced-colors:bg-[Canvas]"
          min={0}
          max={target}
          value={nextTotal}
          aria-labelledby={labelId}
        >
          {clampedNextTotal > 0 ? (
            <Meter.Indicator
              className="flex gap-[0.125rem] overflow-hidden rounded-full"
              style={{
                width: `${(clampedNextTotal / target) * 100}%`,
              }}
            >
              {greyPercent > 0 ? (
                <span
                  className="bg-grey-900 forced-colors:bg-[CanvasText]"
                  style={{ flexGrow: greyPercent * 100 }}
                />
              ) : null}
              {greenPercent > 0 ? (
                <span
                  className="bg-green forced-colors:bg-[CanvasText]"
                  style={{ flexGrow: greenPercent * 100 }}
                />
              ) : null}
            </Meter.Indicator>
          ) : null}
        </Meter.Root>
      </p>
      <div className="mt-150 flex items-center justify-between">
        <p className="text-preset-5-bold text-green">
          {percent(clampedNextTotal / target)}
        </p>
        <p className="text-end text-preset-5">
          Target of{" "}
          {currency(target, {
            trailingZeroDisplay: "stripIfInteger",
          })}
        </p>
      </div>
    </div>
  );
};

export default MeterSection;
