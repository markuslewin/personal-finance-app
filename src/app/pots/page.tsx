import Link from "next/link";
import { Fragment } from "react";
import { db } from "~/server/db";

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
  });

  return (
    <>
      <h1 className="text-preset-1">Pots</h1>
      <p>
        <Link href={"/pots/add"}>
          <span aria-hidden="true">+ </span>Add New Pot
        </Link>
      </p>
      {pots.map((pot) => {
        return (
          <Fragment key={pot.id}>
            <h2 className="text-preset-2">{pot.name}</h2>
            <div className="size-500" style={{ background: pot.theme.color }} />
            <pre>{JSON.stringify(pot, undefined, "\t")}</pre>
            <p>
              <Link href={"/pots/edit"}>Edit Pot</Link>
            </p>
            <p>
              <Link href={"/pots/add-money"}>
                <span aria-hidden="true">+ </span>Add Money
              </Link>
            </p>
            <p>
              <Link href={"/pots/withdraw"}>Withdraw</Link>
            </p>
          </Fragment>
        );
      })}
    </>
  );
};

export default PotsPage;
