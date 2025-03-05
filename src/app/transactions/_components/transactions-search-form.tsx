"use client";

import { cx } from "class-variance-authority";
import { usePathname, useRouter } from "next/navigation";
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
import { type SearchSchema } from "~/app/transactions/_search";
import * as IconCombobox from "~/app/_components/ui/icon-combobox";
import { sortingOptions } from "~/app/_sort";

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

      // Reset `?page` by ignoring existing search params
      router.replace(
        `${pathname}?${new URLSearchParams(nextOptimisticValues)}`,
        { scroll: false },
      );
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
        <IconCombobox.Root className="inline-flex items-center gap-100">
          <IconCombobox.Name>Sort by </IconCombobox.Name>
          <span className="grid size-250 place-items-center text-grey-900 tablet:hidden">
            <IconSortMobile />
          </span>
          <IconCombobox.Control
            name="sort"
            value={optimisticValues.sort ?? sortingOptions[0]}
            onChange={handleChange}
          >
            {sortingOptions.map((option) => {
              return <option key={option}>{option}</option>;
            })}
          </IconCombobox.Control>
        </IconCombobox.Root>
        <IconCombobox.Root className="inline-flex items-center gap-100">
          <IconCombobox.Name>Category </IconCombobox.Name>
          <span className="grid size-250 place-items-center text-grey-900 tablet:hidden">
            <IconFilterMobile />
          </span>
          <IconCombobox.Control
            name="category"
            value={optimisticValues.category ?? ""}
            onChange={handleChange}
          >
            <option value="">All Transactions</option>
            {categories.map((category) => {
              return <option key={category.id}>{category.name}</option>;
            })}
          </IconCombobox.Control>
        </IconCombobox.Root>
      </div>
    </form>
  );
};

export default TransactionsSearchForm;
