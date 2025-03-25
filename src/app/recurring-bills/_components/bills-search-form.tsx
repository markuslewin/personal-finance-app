"use client";

import { Fragment } from "react";
import IconSearch from "~/app/_assets/icon-search.svg";
import IconSortMobile from "~/app/_assets/icon-sort-mobile.svg";
import { Dehydrated, Hydrated } from "~/app/_components/hydration";
import * as IconCombobox from "~/app/_components/ui/icon-combobox";
import * as Select from "~/app/_components/ui/select";
import Textbox from "~/app/_components/ui/textbox";
import { type SortingOption, sortingOptions } from "~/app/_sort";
import * as RadixSelect from "@radix-ui/react-select";
import { useOptimisticSearchParams } from "~/app/_routing";
import { ReadonlyURLSearchParams } from "next/navigation";

const NAME_NAME = "name";
const SORT_NAME = "sort";

type BillsSearchFormProps = {
  defaultSort: SortingOption;
};

export const BillsSearchForm = ({ defaultSort }: BillsSearchFormProps) => {
  const {
    // todo: `isPending`
    isPending,
    searchParams,
    setSearchParams,
  } = useOptimisticSearchParams();

  const name = searchParams.get(NAME_NAME) ?? "";
  const sort = searchParams.get(SORT_NAME) ?? defaultSort;

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
              name={NAME_NAME}
              placeholder="Search bills"
              value={name}
              onChange={(e) => {
                setSearchParams(
                  new ReadonlyURLSearchParams({
                    ...Object.fromEntries(searchParams),
                    [e.target.name]: e.target.value,
                  }),
                );
              }}
            />
            <span className="absolute inset-y-0 right-250 grid size-200 place-items-center">
              <IconSearch className="h-[0.875rem]" />
            </span>
          </span>
        </label>
      </div>
      <Dehydrated>
        <IconCombobox.Root className="inline-flex items-center gap-100">
          <IconCombobox.Name>Sort by </IconCombobox.Name>
          <span className="grid size-250 place-items-center text-grey-900 tablet:hidden">
            <IconSortMobile className="h-[0.9375rem]" />
          </span>
          <IconCombobox.Control name={SORT_NAME} defaultValue={sort}>
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
            value={sort}
            onValueChange={(value) => {
              setSearchParams(
                new ReadonlyURLSearchParams({
                  ...Object.fromEntries(searchParams),
                  [SORT_NAME]: value,
                }),
              );
            }}
          >
            <RadixSelect.Trigger className="group tablet:select-trigger">
              <span className="grid size-250 place-items-center text-grey-900 tablet:hidden">
                <IconSortMobile className="h-[0.9375rem]" />
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
