"use client";

import { cx } from "class-variance-authority";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, type ComponentPropsWithRef } from "react";

interface NavLinkProps extends ComponentPropsWithRef<typeof Link> {
  name: string;
  icon: ReactNode;
}

const NavLink = ({ name, icon, ...props }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === props.href;

  return (
    <Link
      className={cx(
        "grid gap-50 rounded-t-lg border-b-[0.25rem] py-100 transition-[background,border-color] desktop:grid-cols-[auto_1fr] desktop:items-center desktop:gap-200 desktop:rounded-r-xl desktop:rounded-tl-none desktop:border-b-0 desktop:border-l-[0.25rem] desktop:py-200 desktop:pl-[1.75rem]",
        isActive
          ? "border-green bg-beige-100 text-grey-900"
          : "hocus:text-white border-[transparent] forced-colors:border-[Canvas]",
      )}
      aria-current={isActive ? "page" : undefined}
      {...props}
    >
      <span
        className={cx(
          "grid justify-center transition-colors",
          isActive ? "text-green" : "",
        )}
      >
        <span className="grid size-300 place-items-center">{icon}</span>
      </span>
      <span className="sr-only !whitespace-nowrap transition-colors tablet:not-sr-only">
        {name}
      </span>
    </Link>
  );
};

export default NavLink;
