"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Fragment, useOptimistic, useTransition } from "react";
import IconSearch from "~/app/_assets/icon-search.svg";
import IconSortMobile from "~/app/_assets/icon-sort-mobile.svg";
import { Dehydrated, Hydrated } from "~/app/_components/hydration";
import * as IconCombobox from "~/app/_components/ui/icon-combobox";
import * as Select from "~/app/_components/ui/select";
import Textbox from "~/app/_components/ui/textbox";
import { type SortingOption, sortingOptions } from "~/app/_sort";
import * as RadixSelect from "@radix-ui/react-select";

const SORT_NAME = "sort";

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

  const setSearchParam = (name: string, value: string) => {
    startTransition(() => {
      const nextOptimisticValues = {
        ...optimisticValues,
        [name]: value,
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
    <form
      className="flex flex-wrap items-center gap-300"
      onSubmit={(e) => {
        e.preventDefault();
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
              value={optimisticValues.name}
              onChange={(e) => {
                setSearchParam(e.target.name, e.target.value);
              }}
            />
            <span className="absolute inset-y-0 right-250 grid size-200 place-items-center">
              <IconSearch />
            </span>
          </span>
        </label>
      </div>
      <Dehydrated>
        <IconCombobox.Root className="inline-flex items-center gap-100">
          <IconCombobox.Name>Sort by </IconCombobox.Name>
          <span className="grid size-250 place-items-center text-grey-900 tablet:hidden">
            <IconSortMobile />
          </span>
          <IconCombobox.Control
            name={SORT_NAME}
            defaultValue={optimisticValues.sort}
          >
            {sortingOptions.map((option) => {
              return <option key={option}>{option}</option>;
            })}
          </IconCombobox.Control>
        </IconCombobox.Root>
      </Dehydrated>
      <Hydrated>
        <label className="inline-flex items-center gap-100">
          <span className="sr-only tablet:not-sr-only">Sort by </span>
          <Select.Root
            value={optimisticValues.sort}
            onValueChange={(value) => {
              setSearchParam(SORT_NAME, value);
            }}
          >
            <RadixSelect.Trigger className="group tablet:select-trigger">
              <span className="grid size-250 place-items-center text-grey-900 tablet:hidden">
                <IconSortMobile />
              </span>
              {/* `Select.Value` shouldn't be styled, but we have to hide it to match the mobile design. */}
              {/* Mobile widget more closely resembles a `DropdownMenu`, but with the semantics for a currently selected value. */}
              <span className="sr-only tablet:not-sr-only">
                <Select.Value />
              </span>
              <Select.Icon className="hidden tablet:grid" />
            </RadixSelect.Trigger>
            <Select.Portal>
              <Select.Content>
                <Select.Group>
                  <Select.Label className="px-250 py-150 text-grey-500 tablet:sr-only">
                    Sort by
                  </Select.Label>
                  <Select.Separator className="tablet:hidden" />
                  {sortingOptions.map((option, i) => {
                    return (
                      <Fragment key={option}>
                        {i !== 0 ? <Select.Separator /> : null}
                        <Select.Item value={option}>
                          <Select.ItemText>{option}</Select.ItemText>
                        </Select.Item>
                      </Fragment>
                    );
                  })}
                </Select.Group>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </label>
      </Hydrated>
    </form>
  );
};
