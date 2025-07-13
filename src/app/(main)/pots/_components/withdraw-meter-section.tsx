"use client";

import { useField } from "@conform-to/react";
import { useId } from "react";
import { amount as amountSchema } from "~/app/(main)/pots/_schemas";
import * as Meter from "~/app/_components/meter";
import { currency, percent } from "~/app/_format";

type WithdrawMeterSectionProps = {
  name: string;
  total: number;
  target: number;
};

// todo: Merge with `MeterSection`
const WithdrawMeterSection = ({
  name,
  total,
  target,
}: WithdrawMeterSectionProps) => {
  const labelId = useId();
  const [meta] = useField(name);

  const amount = amountSchema.catch(0).parse(Number(meta.value));

  const clampedAmount = Math.max(0, amount - Math.max(0, total - target));
  const clampedTotal = Math.min(target, total);
  const nextTotal = Math.max(0, total - amount);

  const greyPercent = nextTotal / clampedTotal;
  const redPercent = clampedAmount / clampedTotal;

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
          {clampedTotal > 0 ? (
            <Meter.Indicator
              className="flex gap-[0.125rem] overflow-hidden rounded-full"
              style={{
                width: `${(clampedTotal / target) * 100}%`,
              }}
            >
              {greyPercent > 0 ? (
                <span
                  className="bg-grey-900 forced-colors:bg-[CanvasText]"
                  style={{ flexGrow: greyPercent * 100 }}
                />
              ) : null}
              {redPercent > 0 ? (
                <span
                  className="bg-red forced-color-adjust-none"
                  style={{ flexGrow: redPercent * 100 }}
                />
              ) : null}
            </Meter.Indicator>
          ) : null}
        </Meter.Root>
      </p>
      <div className="mt-150 flex items-center justify-between">
        <p className="text-preset-5-bold text-red">
          {percent(nextTotal / target)}
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

export default WithdrawMeterSection;
