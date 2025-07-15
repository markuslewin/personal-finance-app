import { type Metadata } from "next";
import { Link } from "~/app/_components/link";
import * as Meter from "~/app/_components/meter";
import IconEllipsis from "~/app/_assets/icon-ellipsis.svg";
import { currency, percent } from "~/app/_format";
import { Dehydrated, Hydrated } from "~/app/_components/hydration";
import PotActions from "~/app/(main)/pots/_components/pot-actions-menu";
import { useId } from "react";
import { clamp } from "~/app/_math";
import Button from "~/app/_components/ui/button";
import { getPots } from "~/server/pot";

export const metadata: Metadata = {
  title: "Pots",
};

const PotsPage = async () => {
  const pots = await getPots();

  return (
    <article>
      <header className="flex flex-wrap items-center justify-between">
        <h1 className="text-preset-1">Pots</h1>
        <Button asChild>
          <Link href={"/pots/add"}>
            <span aria-hidden="true">+ </span>Add New Pot
          </Link>
        </Button>
      </header>
      <div className="mt-400 grid gap-300 desktop:grid-cols-2">
        {pots.map((pot) => {
          return <Pot key={pot.id} pot={pot} />;
        })}
      </div>
    </article>
  );
};

type PotProps = {
  pot: {
    id: string;
    name: string;
    target: number;
    total: number;
    theme: {
      color: string;
    };
  };
};

const Pot = ({ pot }: PotProps) => {
  const meterLabelId = useId();

  return (
    <article
      className="rounded-xl bg-white px-250 py-300 text-grey-500 tablet:px-300 forced-colors:border-[0.0625rem]"
      style={{
        ["--theme-color" as string]: pot.theme.color,
      }}
      data-testid="pot"
    >
      <header className="grid grid-cols-[auto_1fr_auto] items-center gap-200">
        <div className="size-200 rounded-full bg-[var(--theme-color)] forced-color-adjust-none" />
        <h2
          className="text-preset-2 [overflow-wrap:anywhere] text-grey-900"
          data-testid="name"
        >
          {pot.name}
        </h2>
        <Hydrated>
          <PotActions pot={pot} />
        </Hydrated>
        <Dehydrated>
          <Link
            className="transition-colors hocus:text-grey-900"
            href={`/pots/${pot.id}/edit`}
          >
            <span className="grid size-200 place-items-center">
              <IconEllipsis className="h-[0.25rem]" />
            </span>
            <span className="sr-only">{`Edit pot "${pot.name}"`}</span>
          </Link>
        </Dehydrated>
      </header>
      <div className="mt-500 flex flex-wrap items-center justify-between">
        <h3 id={meterLabelId}>Total Saved</h3>
        <p className="text-preset-1 text-grey-900" data-testid="total">
          <strong>{currency(pot.total)}</strong>
        </p>
      </div>
      <div className="mt-200 text-preset-5">
        <p>
          <Meter.Root
            className="grid h-100 rounded-full bg-beige-100 forced-colors:border-[0.0625rem] forced-colors:bg-[Canvas]"
            min={0}
            max={pot.target}
            value={pot.total}
            aria-labelledby={meterLabelId}
          >
            <Meter.Indicator
              className="rounded-full bg-[var(--theme-color)] forced-colors:bg-[CanvasText]"
              style={{
                width: `${clamp(0, 100, (pot.total / pot.target) * 100)}%`,
              }}
            />
          </Meter.Root>
        </p>
        <div className="mt-150 flex items-center justify-between">
          <p className="text-preset-5-bold">
            {percent(pot.total / pot.target)}
          </p>
          <p className="text-end">
            Target of{" "}
            {currency(pot.target, {
              trailingZeroDisplay: "stripIfInteger",
            })}
          </p>
        </div>
      </div>
      <h3 className="sr-only">Actions</h3>
      <ul className="mt-500 grid grid-cols-2 gap-200" role="list">
        <li className="grid">
          <Link
            className="rounded-lg border-[0.0625rem] border-beige-100 bg-beige-100 p-[0.9375rem] text-center text-preset-4-bold text-grey-900 transition-colors hocus:border-grey-500 hocus:bg-white"
            href={`/pots/${pot.id}/add-money`}
          >
            <span aria-hidden="true">+ </span>Add Money
          </Link>
        </li>
        <li className="grid">
          <Link
            className="rounded-lg border-[0.0625rem] border-beige-100 bg-beige-100 p-[0.9375rem] text-center text-preset-4-bold text-grey-900 transition-colors hocus:border-grey-500 hocus:bg-white"
            href={`/pots/${pot.id}/withdraw`}
          >
            Withdraw
          </Link>
        </li>
      </ul>
    </article>
  );
};

export default PotsPage;
