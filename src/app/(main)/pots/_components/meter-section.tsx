"use client";

import { useField } from "@conform-to/react";
import { amount as amountSchema } from "~/app/(main)/pots/_schemas";
import Status from "~/app/_components/status";
import { formatCents } from "~/app/_currency";
import { percent } from "~/app/_format";

type MeterSectionProps = {
  name: string;
  total: number;
  target: number;
};

// todo: Merge with `WithdrawMeterSection`
const MeterSection = ({ name, total, target }: MeterSectionProps) => {
  const [meta] = useField(name);

  const amount = amountSchema.catch(0).parse(meta.value);
  const clampedAmount = Math.min(target - total, amount);
  const nextTotal = total + amount;
  const clampedNextTotal = Math.min(target, nextTotal);

  const greyPercent = total / clampedNextTotal;
  const greenPercent = clampedAmount / clampedNextTotal;

  return (
    <div>
      <p className="flex flex-wrap items-center justify-between">
        <span>
          <span>New Amount</span>
          <span className="sr-only">: </span>
        </span>
        <span className="text-preset-1 text-grey-900">
          {formatCents(nextTotal)}
        </span>
      </p>
      <p className="mt-200">
        <span className="grid h-100 rounded-full bg-beige-100 forced-colors:border-[0.0625rem] forced-colors:bg-[Canvas]">
          {clampedNextTotal > 0 ? (
            <span
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
            </span>
          ) : null}
        </span>
      </p>
      <div className="mt-150 flex items-center justify-between">
        <p className="text-preset-5-bold text-green">
          <Status>{percent(clampedNextTotal / target)}</Status>
        </p>
        <p className="text-end text-preset-5">
          Target of{" "}
          {formatCents(target, {
            trailingZeroDisplay: "stripIfInteger",
          })}
        </p>
      </div>
    </div>
  );
};

export default MeterSection;
