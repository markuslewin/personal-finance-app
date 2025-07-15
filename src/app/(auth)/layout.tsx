import { Link } from "~/app/_components/link";
import { type ReactNode } from "react";
import LogoLarge from "~/app/_assets/logo-large.svg";

type AuthLayoutProps = {
  children: ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="bg-beige-100 text-grey-900">
      <div className="mx-auto grid min-h-screen max-w-[90rem] grid-rows-[auto_1fr] desktop:grid-cols-[600fr_840fr] desktop:grid-rows-none">
        <div className="grid items-center desktop:p-250">
          <div className="grid rounded-b-lg bg-grey-900 py-300 text-white desktop:min-h-[57.5rem] desktop:grid-rows-[1fr_auto] desktop:rounded-xl desktop:bg-[url(/assets/images/illustration-authentication.svg)] desktop:bg-cover desktop:bg-center desktop:p-500">
            <header className="flex justify-center desktop:items-start desktop:justify-start">
              <Link href={"/"}>
                <LogoLarge className="h-[1.375rem]" />
                <span className="sr-only">Finance</span>
              </Link>
            </header>
            {/* todo: `header`, `main`? */}
            {/* <h1>TODO</h1> */}
            <div className="hidden desktop:block">
              <h2 className="text-preset-1">
                Keep track of your money and save for your future
              </h2>
              <p className="mt-300">
                Personal finance app puts you in control of your spending. Track
                transactions, set budgets, and add to savings pots easily.
              </p>
            </div>
          </div>
        </div>
        <main className="grid grid-cols-[minmax(auto,35rem)] items-center justify-center px-200 py-250">
          <div>{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;
