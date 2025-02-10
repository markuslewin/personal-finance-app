import { type Metadata } from "next";
import Link from "next/link";
import { db } from "~/server/db";
import * as Meter from "~/app/_components/meter";
import IconEllipsis from "~/app/_assets/icon-ellipsis.svg";
import { currency } from "~/app/_format";

export const metadata: Metadata = {
  title: "Pots",
};

const PotsPage = async () => {
  const pots = await db.pot.findMany({
    select: {
      id: true,
      name: true,
      target: true,
      total: true,
      theme: {
        select: {
          color: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <article>
      <header className="flex flex-wrap items-center justify-between">
        <h1 className="text-preset-1">Pots</h1>
        <Link
          className="rounded-lg bg-grey-900 p-200 text-preset-4-bold text-white transition-colors hocus:bg-grey-500"
          href={"/pots/add"}
        >
          <span aria-hidden="true">+ </span>Add New Pot
        </Link>
      </header>
      <div className="mt-400 grid gap-300 desktop:grid-cols-2">
        {pots.map((pot) => {
          return (
            <article
              className="rounded-xl bg-white px-250 py-300 text-grey-500 tablet:px-300"
              key={pot.id}
            >
              <header className="flex flex-wrap items-center justify-between">
                <div className="grid grid-cols-[auto_1fr] items-center gap-200">
                  <div
                    className="size-200 rounded-full"
                    style={{ background: pot.theme.color }}
                  />
                  <h2 className="text-preset-2 text-grey-900">{pot.name}</h2>
                </div>
                <div className="grid size-200 place-items-center">
                  <Link
                    className="transition-colors hocus:text-grey-900"
                    href={`/pots/${pot.id}/edit`}
                  >
                    <IconEllipsis />
                    <span className="sr-only">{`Edit pot "${pot.name}"`}</span>
                  </Link>
                </div>
              </header>
              <div className="mt-500 flex flex-wrap items-center justify-between">
                <h3>Total Saved</h3>
                <p className="text-preset-1 text-grey-900">
                  <strong>{currency(pot.total)}</strong>
                </p>
              </div>
              <div className="mt-200 text-preset-5">
                <p>
                  <Meter.Root
                    className="grid h-100 rounded-full bg-beige-100"
                    name="Saved"
                    min={0}
                    max={pot.target}
                    value={pot.total}
                  >
                    <Meter.Indicator
                      className="w-1/2 rounded-full"
                      style={{ background: pot.theme.color }}
                    />
                  </Meter.Root>
                </p>
                <div className="mt-150 flex items-center justify-between">
                  <p className="text-preset-5-bold">TODO</p>
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
        })}
      </div>
    </article>
  );
};

export default PotsPage;
