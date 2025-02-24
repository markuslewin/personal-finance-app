import "~/styles/globals.css";

import { type Metadata } from "next";
import { publicSans } from "~/app/_fonts";
import Link from "next/link";
// import { db } from "~/server/db";
// import { logOut } from "~/app/_actions";
// import { getSession } from "~/app/_auth";
import AssetLogoLarge from "~/app/_assets/logo-large.svg";
import AssetLogoSmall from "~/app/_assets/logo-small.svg";
import IconMinimizeMenu from "~/app/_assets/icon-minimize-menu.svg";
import IconNavBudgets from "~/app/_assets/icon-nav-budgets.svg";
import IconNavOverview from "~/app/_assets/icon-nav-overview.svg";
import IconNavPots from "~/app/_assets/icon-nav-pots.svg";
import IconNavRecurringBills from "~/app/_assets/icon-nav-recurring-bills.svg";
import IconNavTransactions from "~/app/_assets/icon-nav-transactions.svg";
import NavLink from "~/app/_components/ui/nav-link";
import { type ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    template: "Frontend Mentor | Personal finance app - %s",
    default: "Frontend Mentor | Personal finance app",
  },
  description: "A personal finance app.",
  icons: [
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/assets/images/favicon-32x32.png",
    },
  ],
};

export default async function RootLayout({
  children,
  dialog,
}: Readonly<{ children: ReactNode; dialog: ReactNode }>) {
  // const userId = await getSession();
  // let user;
  // if (typeof userId === "string") {
  //   user = await db.user.findUnique({
  //     select: {
  //       name: true,
  //     },
  //     where: {
  //       id: userId,
  //     },
  //   });
  // }

  return (
    <html lang="en" className={`${publicSans.variable}`}>
      <body className="bg-grey-900 font-public-sans text-preset-4">
        <div className="min-h-screen bg-beige-100 text-grey-900 desktop:grid desktop:grid-cols-[18.75rem_1fr]">
          <header className="fixed inset-x-0 bottom-0 z-10 rounded-t-lg bg-grey-900 text-preset-5-bold text-grey-300 desktop:sticky desktop:top-0 desktop:flex desktop:h-screen desktop:flex-col desktop:gap-300 desktop:overflow-y-auto desktop:rounded-r-2xl desktop:rounded-tl-none desktop:pb-500 desktop:text-preset-3">
            <p className="hidden px-400 py-500 text-white desktop:block">
              <Link href={"/"}>
                {/* <AssetLogoSmall /> */}
                <AssetLogoLarge />
                <span className="sr-only">Finance</span>
              </Link>
            </p>
            <nav className="px-200 pt-100 tablet:px-500 desktop:px-0 desktop:pr-300 desktop:pt-0">
              <ul
                className="flex justify-between desktop:flex-col desktop:justify-normal desktop:gap-50 desktop:p-0"
                role="list"
              >
                {[
                  { name: "Overview", href: "/", icon: <IconNavOverview /> },
                  {
                    name: "Transactions",
                    href: "/transactions",
                    icon: <IconNavTransactions />,
                  },
                  {
                    name: "Budgets",
                    href: "/budgets",
                    icon: <IconNavBudgets />,
                  },
                  { name: "Pots", href: "/pots", icon: <IconNavPots /> },
                  {
                    name: "Recurring Bills",
                    href: "/recurring-bills",
                    icon: <IconNavRecurringBills />,
                  },
                ].map((link) => {
                  return (
                    <li
                      className="grid basis-[6.5rem] text-center desktop:basis-auto desktop:text-start"
                      key={link.href}
                    >
                      <NavLink {...link} />
                    </li>
                  );
                })}
              </ul>
            </nav>
            {/* todo: Action */}
            <form className="mt-auto hidden desktop:grid">
              <button
                className="grid grid-cols-[auto_1fr] items-center gap-200 py-200 pl-400 text-start transition-colors hocus:text-white"
                type="submit"
              >
                <span className="grid size-300 place-items-center">
                  <IconMinimizeMenu />
                </span>{" "}
                Minimize menu
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
          {/* Padding creates buffer for fixed `header` */}
          <main className="px-200 pb-[5.25rem] pt-300 tablet:px-500 tablet:pb-[6.625rem] tablet:pt-500 desktop:pb-400">
            <div className="mx-auto max-w-[66.25rem]">{children}</div>
          </main>
        </div>
        {dialog}
      </body>
    </html>
  );
}
