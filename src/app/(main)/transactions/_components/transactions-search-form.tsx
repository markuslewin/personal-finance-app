"use client";

import { cx } from "class-variance-authority";
import { ReadonlyURLSearchParams } from "next/navigation";
import { Portal, Select as RadixSelect } from "radix-ui";
import { type ComponentPropsWithRef, Fragment, useState } from "react";
import { DEFAULT_SORT } from "~/app/(main)/transactions/_search";
import IconFilterMobile from "~/app/_assets/icon-filter-mobile.svg";
import IconSearch from "~/app/_assets/icon-search.svg";
import IconSortMobile from "~/app/_assets/icon-sort-mobile.svg";
import { Dehydrated, Hydrated } from "~/app/_components/hydration";
import Status from "~/app/_components/status";
import * as IconCombobox from "~/app/_components/ui/icon-combobox";
import * as Select from "~/app/_components/ui/select";
import Spinner from "~/app/_components/ui/spinner";
import Textbox from "~/app/_components/ui/textbox";
import { useOptimisticSearchParams } from "~/app/_routing";
import { sortingOptions } from "~/app/_sort";

const NAME_NAME = "name";
const SORT_NAME = "sort";
const CATEGORY_NAME = "category";

const ALL_CATEGORY_VALUE = "all";

type TransactionsSearchFormProps = ComponentPropsWithRef<"form"> & {
  categories: { id: string; name: string }[];
};

const TransactionsSearchForm = ({
  className,
  categories,
  ...props
}: TransactionsSearchFormProps) => {
  const [status, setStatus] = useState("");
  const { pending, searchParams, setSearchParams } = useOptimisticSearchParams({
    onDone: () => {
      setStatus("Loaded transactions");
    },
  });

  const handleChange = (name: string, value: string) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set(name, value);
    // Reset page whenever params change
    nextSearchParams.delete("page");
    setSearchParams(new ReadonlyURLSearchParams(nextSearchParams));
  };

  // todo: Schema validation
  const name = searchParams.get(NAME_NAME) ?? "";
  const sort = searchParams.get(SORT_NAME) ?? DEFAULT_SORT;
  const category = searchParams.get(CATEGORY_NAME);

  return (
    <>
      <form
        {...props}
        className={cx(className, "flex flex-wrap items-center gap-300")}
      >
        <div className="grow">
          <label>
            <span className="sr-only">Search: </span>
            <span className="relative text-grey-900">
              <Textbox
                className="max-w-[20rem]"
                name={NAME_NAME}
                placeholder="Search transaction"
                value={name}
                onChange={(e) => {
                  handleChange(NAME_NAME, e.target.value);
                }}
              />
              <span className="absolute inset-y-0 right-250 grid size-200 place-items-center">
                {pending ? (
                  <Spinner />
                ) : (
                  <IconSearch className="h-[0.875rem]" />
                )}
              </span>
            </span>
          </label>
        </div>
        <div className="flex flex-wrap gap-300">
          <Dehydrated>
            <IconCombobox.Root className="inline-flex items-center gap-100">
              <IconCombobox.Name>Sort by </IconCombobox.Name>
              <span className="grid size-250 place-items-center text-grey-900 tablet:hidden">
                <IconSortMobile className="h-[0.9375rem]" />
              </span>
              <IconCombobox.Control
                name={SORT_NAME}
                value={sort}
                onChange={(e) => {
                  handleChange(SORT_NAME, e.target.value);
                }}
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
                value={sort}
                onValueChange={(value) => {
                  handleChange(SORT_NAME, value);
                }}
              >
                <RadixSelect.Trigger className="group clickable tablet:select-trigger tablet:clickable-none">
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
          <Dehydrated>
            <IconCombobox.Root className="inline-flex items-center gap-100">
              <IconCombobox.Name>Category </IconCombobox.Name>
              <span className="grid size-250 place-items-center text-grey-900 tablet:hidden">
                <IconFilterMobile className="h-[1rem]" />
              </span>
              <IconCombobox.Control
                name={CATEGORY_NAME}
                value={category ?? ""}
                onChange={(e) => {
                  handleChange(CATEGORY_NAME, e.target.value);
                }}
              >
                <option value="">All Transactions</option>
                {categories.map((category) => {
                  return (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  );
                })}
              </IconCombobox.Control>
            </IconCombobox.Root>
          </Dehydrated>
          <Hydrated>
            <label className="inline-flex items-center gap-100">
              <span className="sr-only tablet:not-sr-only">Category </span>
              {/* Radix Select treats empty strings as no value, so we do some additional conversion here */}
              <Select.Root
                value={
                  category === null || category === ""
                    ? ALL_CATEGORY_VALUE
                    : category
                }
                onValueChange={(value) => {
                  handleChange(
                    CATEGORY_NAME,
                    value === ALL_CATEGORY_VALUE ? "" : value,
                  );
                }}
              >
                <RadixSelect.Trigger className="group clickable tablet:select-trigger tablet:clickable-none">
                  <span className="grid size-250 place-items-center text-grey-900 tablet:hidden">
                    <IconFilterMobile className="h-[1rem]" />
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
                        Category
                      </Select.Label>
                      <Select.Separator className="tablet:hidden" />
                      <Select.Item value={ALL_CATEGORY_VALUE}>
                        <Select.ItemText>All Transactions</Select.ItemText>
                      </Select.Item>
                      {categories.map((category) => {
                        return (
                          <Select.Item key={category.id} value={category.name}>
                            <Select.ItemText>{category.name}</Select.ItemText>
                          </Select.Item>
                        );
                      })}
                    </Select.Group>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </label>
          </Hydrated>
        </div>
      </form>
      {/* User doesn't need to know about this element */}
      <Portal.Root>
        <Status className="sr-only">
          {pending ? <>Loading transactions</> : <>{status}</>}
        </Status>
      </Portal.Root>
    </>
  );
};

export default TransactionsSearchForm;
