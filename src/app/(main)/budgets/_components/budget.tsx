import { Link } from "~/app/_components/link";
import Image from "next/image";
import { useId } from "react";
import BudgetActions from "~/app/(main)/budgets/_components/budget-actions-menu";
import { Hydrated, Dehydrated } from "~/app/_components/hydration";
import { date } from "~/app/_format";
import { clamp } from "~/app/_math";
import IconCaretRight from "~/app/_assets/icon-caret-right.svg";
import IconEllipsis from "~/app/_assets/icon-ellipsis.svg";
import * as Meter from "~/app/_components/meter";
import { formatCents } from "~/app/_currency";

type BudgetProps = {
  budget: {
    id: string;
    maximum: number;
    category: {
      name: string;
      Transaction: {
        id: string;
        name: string;
        avatar: string;
        amount: number;
        date: Date;
      }[];
    };
    theme: {
      color: string;
    };
  };
  spent: number;
};

export const Budget = ({ budget, spent }: BudgetProps) => {
  const meterLabelId = useId();
  const latestSpendingLabelId = useId();

  const free = Math.max(0, budget.maximum - spent);

  return (
    <article
      className="rounded-xl bg-white px-250 py-300 text-grey-500 tablet:p-400 forced-colors:border-[0.0625rem]"
      style={{
        ["--theme-color" as string]: budget.theme.color,
      }}
      data-testid="budget"
    >
      <header className="grid grid-cols-[auto_1fr_auto] items-center gap-200">
        <div className="size-200 rounded-full bg-[var(--theme-color)] forced-color-adjust-none" />
        <h3 className="text-preset-2 text-grey-900" data-testid="name">
          {budget.category.name}
        </h3>
        <Hydrated>
          <BudgetActions budget={budget} />
        </Hydrated>
        <Dehydrated>
          <Link
            className="transition-colors hocus:text-grey-900"
            href={`/budgets/${budget.id}/edit`}
          >
            <span className="grid size-200 place-items-center">
              <IconEllipsis className="h-[0.25rem]" />
            </span>
            <span className="sr-only">
              {`Edit budget "${budget.category.name}"`}
            </span>
          </Link>
        </Dehydrated>
      </header>
      <p className="mt-250">Maximum of {formatCents(budget.maximum)}</p>
      <p className="mt-200">
        <span className="sr-only" id={meterLabelId}>
          Amount spent
        </span>
        <Meter.Root
          className="grid h-400 rounded-sm bg-beige-100 p-50 forced-colors:border-[0.0625rem] forced-colors:bg-[Canvas]"
          min={0}
          max={budget.maximum}
          value={spent}
          aria-labelledby={meterLabelId}
        >
          <Meter.Indicator
            className="rounded-sm bg-[var(--theme-color)] forced-colors:bg-[CanvasText]"
            style={{
              width: `${clamp(0, 100, (spent / budget.maximum) * 100)}%`,
            }}
          />
        </Meter.Root>
      </p>
      <div className="mt-200 grid grid-cols-2 gap-200 text-preset-5">
        <div className="grid grid-cols-[auto_1fr] gap-200">
          <div className="w-50 rounded-full bg-[var(--theme-color)] forced-colors:bg-[CanvasText]" />
          <div className="grid gap-50">
            <h4>Spent</h4>
            <p
              className="text-preset-4-bold text-grey-900"
              data-testid="budget-spent"
            >
              {formatCents(spent)}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-[auto_1fr] gap-200">
          <div className="w-50 rounded-full bg-beige-100 forced-colors:border-[0.0625rem] forced-colors:bg-[Canvas]" />
          <div className="grid gap-50">
            <h4>Free</h4>
            <p
              className="text-preset-4-bold text-grey-900"
              data-testid="budget-free"
            >
              {formatCents(free)}
            </p>
          </div>
        </div>
      </div>
      <article className="mt-250 rounded-xl bg-beige-100 p-200 text-grey-500 tablet:p-250 forced-colors:border-[0.0625rem]">
        <header className="flex flex-wrap justify-between">
          <h4
            className="text-preset-3 text-grey-900"
            id={latestSpendingLabelId}
          >
            Latest Spending
          </h4>
          <Link
            className="grid grid-cols-[1fr_auto] items-center gap-150 transition-colors hocus:text-grey-900"
            href={`/transactions?category=${encodeURIComponent(budget.category.name)}`}
          >
            See All
            <span className="grid size-150 place-items-center">
              <IconCaretRight className="h-[0.6875rem]" />
            </span>
          </Link>
        </header>
        <ol
          className="mt-250 space-y-150 divide-y-[0.0625rem] divide-grey-500/15 text-preset-5 add-space-y-150"
          role="list"
          aria-labelledby={latestSpendingLabelId}
        >
          {budget.category.Transaction.map((transaction) => {
            return (
              <li
                className="grid grid-cols-[1fr_auto] items-center gap-200 tablet:grid-cols-[auto_1fr_auto]"
                key={transaction.id}
              >
                <Image
                  className="hidden size-400 rounded-full tablet:block"
                  alt=""
                  src={transaction.avatar}
                  width={160}
                  height={160}
                />
                <h5 className="text-preset-5-bold text-grey-900">
                  {transaction.name}
                </h5>
                <div className="grid gap-50 text-end">
                  <p className="text-preset-5-bold text-grey-900">
                    <span className="sr-only">Amount: </span>
                    {formatCents(transaction.amount)}
                  </p>
                  <p>
                    <span className="sr-only">Date: </span>
                    {date(transaction.date)}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </article>
    </article>
  );
};
