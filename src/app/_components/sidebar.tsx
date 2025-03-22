"use client";

import { cx } from "class-variance-authority";
import { usePathname, useSearchParams } from "next/navigation";
import {
  type ComponentPropsWithRef,
  startTransition,
  useOptimistic,
} from "react";
import { minimizeMenu } from "~/app/_actions";
import LogoLarge from "~/app/_assets/logo-large.svg";
import LogoSmall from "~/app/_assets/logo-small.svg";
import IconNavBudgets from "~/app/_assets/icon-nav-budgets.svg";
import IconNavOverview from "~/app/_assets/icon-nav-overview.svg";
import IconNavPots from "~/app/_assets/icon-nav-pots.svg";
import IconNavRecurringBills from "~/app/_assets/icon-nav-recurring-bills.svg";
import IconNavTransactions from "~/app/_assets/icon-nav-transactions.svg";
import IconMinimizeMenu from "~/app/_assets/icon-minimize-menu.svg";
import { Dehydrated } from "~/app/_components/hydration";
import Link from "next/link";

type SidebarProps = ComponentPropsWithRef<"div"> & {
  isOpen: boolean;
};

const Sidebar = ({
  className,
  children,
  isOpen: _isOpen,
  ...props
}: SidebarProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useOptimistic(
    _isOpen,
    (_state, value: boolean) => {
      return value;
    },
  );

  return (
    <div
      {...props}
      className={cx(
        className,
        "min-h-screen bg-beige-100 text-grey-900 desktop:grid",
        isOpen
          ? "desktop:grid-cols-[18.75rem_1fr]"
          : "desktop:grid-cols-[5.5rem_1fr]",
      )}
    >
      <header className="fixed inset-x-0 bottom-0 z-10 rounded-t-lg bg-grey-900 text-preset-5-bold text-grey-300 desktop:sticky desktop:top-0 desktop:flex desktop:h-screen desktop:flex-col desktop:gap-300 desktop:overflow-y-auto desktop:rounded-tl-none desktop:rounded-r-2xl desktop:pb-500 desktop:text-preset-3">
        <p
          className={cx(
            "hidden px-400 py-500 text-white desktop:grid",
            !isOpen ? "desktop:justify-center desktop:px-0" : "",
          )}
        >
          <Link href={"/"}>
            {isOpen ? (
              <LogoLarge className="h-[1.375rem]" />
            ) : (
              <LogoSmall className="h-[1.375rem]" />
            )}
            <span className="sr-only">Finance</span>
          </Link>
        </p>
        <nav
          className={cx(
            "px-200 pt-100 tablet:px-500 desktop:px-0 desktop:pt-0",
            isOpen ? "desktop:pr-300" : "desktop:pr-100",
          )}
        >
          <ul
            className="flex justify-between desktop:flex-col desktop:justify-normal desktop:gap-50 desktop:p-0"
            role="list"
          >
            {[
              {
                name: "Overview",
                href: "/",
                icon: <IconNavOverview className="h-[1.1875rem]" />,
              },
              {
                name: "Transactions",
                href: "/transactions",
                icon: <IconNavTransactions className="h-[1.125rem]" />,
              },
              {
                name: "Budgets",
                href: "/budgets",
                icon: <IconNavBudgets className="h-[1.25rem]" />,
              },
              {
                name: "Pots",
                href: "/pots",
                icon: <IconNavPots className="h-[1.375rem]" />,
              },
              {
                name: "Recurring Bills",
                href: "/recurring-bills",
                icon: <IconNavRecurringBills className="h-[1.0625rem]" />,
              },
            ].map((link) => {
              const isActive = `/${pathname.split("/")[1] ?? ""}` === link.href;

              return (
                <li
                  className="grid basis-[6.5rem] text-center desktop:basis-auto desktop:text-start"
                  key={link.href}
                >
                  <Link
                    className={cx(
                      "grid gap-50 rounded-t-lg border-b-[0.25rem] py-100 transition-[background,border-color] desktop:grid-cols-[auto_1fr] desktop:items-center desktop:gap-200 desktop:rounded-tl-none desktop:rounded-r-xl desktop:border-b-0 desktop:border-l-[0.25rem] desktop:py-200 desktop:pl-[1.75rem]",
                      isActive
                        ? "border-green bg-beige-100 text-grey-900"
                        : "border-[transparent] forced-colors:border-[Canvas] hocus:text-white",
                    )}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span
                      className={cx(
                        "grid justify-center transition-colors",
                        isActive ? "text-green" : "",
                      )}
                    >
                      <span className="grid size-300 place-items-center">
                        {link.icon}
                      </span>
                    </span>
                    <span
                      className={cx(
                        "sr-only whitespace-nowrap! transition-colors tablet:not-sr-only",
                        !isOpen ? "desktop:sr-only" : "",
                      )}
                    >
                      {link.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <form
          className="mt-auto hidden desktop:grid"
          action={minimizeMenu}
          onSubmit={(e) => {
            e.preventDefault();

            const formData = new FormData(e.currentTarget);
            startTransition(async () => {
              setIsOpen(formData.get("value") === "true");
              await minimizeMenu(formData);
            });
          }}
        >
          <Dehydrated>
            <input
              type="hidden"
              name="redirectTo"
              defaultValue={`${pathname}?${searchParams.toString()}`}
            />
          </Dehydrated>
          <input type="hidden" name="value" defaultValue={String(!isOpen)} />
          <button
            className="grid grid-cols-[auto_1fr] items-center gap-200 py-200 pl-400 text-start transition-colors hocus:text-white"
            type="submit"
            aria-pressed={!isOpen}
          >
            <span
              className={cx(
                "grid size-300 place-items-center transition-transform",
                !isOpen ? "rotate-180" : "",
              )}
            >
              <IconMinimizeMenu className="h-[1.25rem]" />
            </span>
            <span className={cx(!isOpen ? "desktop:sr-only" : "")}>
              Minimize menu
            </span>
          </button>
        </form>
        {/* todo: User? */}
        {/* {user ? (
            <>
            <p>Hello, {user.name}!</p>
            <form action={logOut}>
                <button type="submit">Log out</button>
              </form>
              </>
              ) : (
                <p>User isn&apos;t logged in</p>
                )} */}
      </header>
      {children}
    </div>
  );
};

export default Sidebar;
