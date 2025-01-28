import "~/styles/globals.css";

import { type Metadata } from "next";
import { publicSans } from "~/app/_fonts";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    template: "Frontend Mentor | Personal finance app - %s",
    default: "Frontend Mentor | Personal finance app",
  },
  description: "A personal fincance app.",
  icons: [
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/assets/images/favicon-32x32.png",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${publicSans.variable}`}>
      <body className="bg-beige-100 font-public-sans text-grey-900">
        <header>
          <nav>
            <ul role="list">
              {[
                { name: "Overview", href: "/" },
                { name: "Transactions", href: "/transactions" },
                { name: "Budgets", href: "/budgets" },
                { name: "Pots", href: "/pots" },
                { name: "Recurring Bills", href: "/recurring-bills" },
              ].map((link) => {
                return (
                  <li key={link.href}>
                    <Link href={link.href}>{link.name}</Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
