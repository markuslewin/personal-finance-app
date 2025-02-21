"use client";

import { cx } from "class-variance-authority";
import { usePathname, useRouter } from "next/navigation";
import { type ComponentPropsWithRef } from "react";
import Textbox from "~/app/_components/ui/textbox";
import IconFilterMobile from "~/app/_assets/icon-filter-mobile.svg";
import IconSearch from "~/app/_assets/icon-search.svg";
import IconSortMobile from "~/app/_assets/icon-sort-mobile.svg";
import { sortingOptions, type SearchSchema } from "~/app/transactions/_search";

type TransactionsSearchFormProps = ComponentPropsWithRef<"form"> & {
  categories: { id: string; name: string }[];
  defaultValues: SearchSchema;
};

const TransactionsSearchForm = ({
  className,
  categories,
  defaultValues,
  ...props
}: TransactionsSearchFormProps) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <form
      {...props}
      className={cx(className, "flex flex-wrap items-center gap-300")}
      onChange={(e) => {
        const formData = new FormData(e.currentTarget);
        const searchParams = new URLSearchParams(
          [...formData.entries()].filter((val): val is [string, string] => {
            return typeof val[1] === "string";
          }),
        );
        router.replace(`${pathname}?${searchParams}`);
      }}
    >
      <div className="grow">
        <label>
          <span className="sr-only">Search: </span>
          <span className="relative text-grey-900">
            <Textbox
              className="w-full max-w-[20rem]"
              name="name"
              placeholder="Search transaction"
              defaultValue={defaultValues.name}
            />
            <span className="absolute inset-y-0 right-250 grid size-200 place-items-center">
              <IconSearch />
            </span>
          </span>
        </label>
      </div>
      <label className="inline-flex items-center gap-100">
        <span className="sr-only tablet:not-sr-only">Sort by </span>
        <span className="grid size-250 place-items-center text-grey-900 tablet:hidden">
          <IconSortMobile />
        </span>
        <select
          className="hidden tablet:block"
          name="sort"
          defaultValue={defaultValues.sort}
        >
          {sortingOptions.map((option) => {
            return <option key={option}>{option}</option>;
          })}
        </select>
      </label>
      <label className="inline-flex items-center gap-100">
        <span className="sr-only tablet:not-sr-only">Category </span>
        <span className="grid size-250 place-items-center text-grey-900 tablet:hidden">
          <IconFilterMobile />
        </span>
        <select
          className="hidden tablet:block"
          name="category"
          defaultValue={defaultValues.category}
        >
          <option value="">All Transactions</option>
          {categories.map((category) => {
            return <option key={category.id}>{category.name}</option>;
          })}
        </select>
      </label>
    </form>
  );
};

export default TransactionsSearchForm;
