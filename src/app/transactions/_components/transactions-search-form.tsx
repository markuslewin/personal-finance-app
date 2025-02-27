"use client";

import { cx } from "class-variance-authority";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  type ChangeEventHandler,
  useOptimistic,
  useTransition,
  type ComponentPropsWithRef,
} from "react";
import Textbox from "~/app/_components/ui/textbox";
import IconFilterMobile from "~/app/_assets/icon-filter-mobile.svg";
import IconSearch from "~/app/_assets/icon-search.svg";
import IconSortMobile from "~/app/_assets/icon-sort-mobile.svg";
import { sortingOptions, type SearchSchema } from "~/app/transactions/_search";
import Combobox from "~/app/_components/ui/combobox";

type TransactionsSearchFormProps = ComponentPropsWithRef<"form"> & {
  categories: { id: string; name: string }[];
  values: SearchSchema;
};

const TransactionsSearchForm = ({
  className,
  categories,
  values,
  ...props
}: TransactionsSearchFormProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // todo: `isPending`
  const [isPending, startTransition] = useTransition();
  const [optimisticValues, setOptimisticValues] = useOptimistic(
    values,
    (_, values: SearchSchema) => values,
  );

  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (e) => {
    startTransition(() => {
      const nextOptimisticValues = {
        ...optimisticValues,
        [e.target.name]: e.target.value,
      };

      setOptimisticValues(nextOptimisticValues);

      // todo: Will have to merge in pending `page` somehow
      const params = new URLSearchParams({
        ...Object.fromEntries(searchParams),
        ...nextOptimisticValues,
      });
      router.replace(`${pathname}?${params}`);
    });
  };

  return (
    <form
      {...props}
      className={cx(className, "flex flex-wrap items-center gap-300")}
    >
      <div className="grow">
        <label>
          <span className="sr-only">Search: </span>
          <span className="relative text-grey-900">
            <Textbox
              className="w-full max-w-[20rem]"
              name="name"
              placeholder="Search transaction"
              value={optimisticValues.name ?? ""}
              onChange={handleChange}
            />
            <span className="absolute inset-y-0 right-250 grid size-200 place-items-center">
              <IconSearch />
            </span>
          </span>
        </label>
      </div>
      <div className="flex flex-wrap gap-300">
        <label className="relative inline-flex items-center gap-100">
          <span className="sr-only tablet:not-sr-only">Sort by </span>
          <span className="grid size-250 place-items-center text-grey-900 tablet:hidden">
            <IconSortMobile />
          </span>
          <Combobox
            className="absolute inset-0 h-auto px-0 opacity-0 tablet:static tablet:inset-auto tablet:h-[2.8125rem] tablet:px-[1.1875rem] tablet:opacity-100"
            name="sort"
            value={optimisticValues.sort ?? sortingOptions[0]}
            onChange={handleChange}
          >
            {sortingOptions.map((option) => {
              return <option key={option}>{option}</option>;
            })}
          </Combobox>
        </label>
        <label className="relative inline-flex items-center gap-100">
          <span className="sr-only tablet:not-sr-only">Category </span>
          <span className="grid size-250 place-items-center text-grey-900 tablet:hidden">
            <IconFilterMobile />
          </span>
          <Combobox
            className="absolute inset-0 h-auto px-0 opacity-0 tablet:static tablet:inset-auto tablet:h-[2.8125rem] tablet:px-[1.1875rem] tablet:opacity-100"
            name="category"
            value={optimisticValues.category ?? ""}
            onChange={handleChange}
          >
            <option value="">All Transactions</option>
            {categories.map((category) => {
              return <option key={category.id}>{category.name}</option>;
            })}
          </Combobox>
        </label>
      </div>
    </form>
  );
};

export default TransactionsSearchForm;
