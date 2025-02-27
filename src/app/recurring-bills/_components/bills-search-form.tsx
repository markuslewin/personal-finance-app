"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ChangeEventHandler, useOptimistic, useTransition } from "react";
import IconSearch from "~/app/_assets/icon-search.svg";
import IconSortMobile from "~/app/_assets/icon-sort-mobile.svg";
import * as IconCombobox from "~/app/_components/ui/icon-combobox";
import Textbox from "~/app/_components/ui/textbox";
import { type SortingOption, sortingOptions } from "~/app/_sort";

type BillsSearchValues = {
  name: string;
  sort: SortingOption;
};

type BillsSearchFormProps = {
  values: BillsSearchValues;
};

export const BillsSearchForm = ({ values }: BillsSearchFormProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // todo: `isPending`
  const [isPending, startTransition] = useTransition();
  const [optimisticValues, setOptimisticValues] = useOptimistic(
    values,
    (_, values: BillsSearchValues) => values,
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

      const params = new URLSearchParams({
        ...Object.fromEntries(searchParams),
        ...nextOptimisticValues,
      });
      router.replace(`${pathname}?${params}`, { scroll: false });
    });
  };

  return (
    <form className="flex flex-wrap items-center gap-300">
      <div className="grow">
        <label>
          <span className="sr-only">Search: </span>
          <span className="relative text-grey-900">
            <Textbox
              className="w-full max-w-[20rem]"
              name="name"
              placeholder="Search transaction"
              value={optimisticValues.name}
              onChange={handleChange}
            />
            <span className="absolute inset-y-0 right-250 grid size-200 place-items-center">
              <IconSearch />
            </span>
          </span>
        </label>
      </div>
      <IconCombobox.Root className="inline-flex items-center gap-100">
        <IconCombobox.Name>Sort by </IconCombobox.Name>
        <span className="grid size-250 place-items-center text-grey-900 tablet:hidden">
          <IconSortMobile />
        </span>
        <IconCombobox.Control
          name="sort"
          value={optimisticValues.sort}
          onChange={handleChange}
        >
          {sortingOptions.map((option) => {
            return <option key={option}>{option}</option>;
          })}
        </IconCombobox.Control>
      </IconCombobox.Root>
    </form>
  );
};
