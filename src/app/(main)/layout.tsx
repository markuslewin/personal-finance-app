import { cookies } from "next/headers";
import { getIsSidebarOpen } from "~/app/_sidebar";
import Sidebar from "~/app/_components/sidebar";
import { type ReactNode } from "react";

export const dynamic = "force-dynamic";

type MainLayoutProps = {
  children: ReactNode;
  dialog: ReactNode;
};

const MainLayout = async ({ children, dialog }: MainLayoutProps) => {
  const isSidebarOpen = getIsSidebarOpen(await cookies());

  return (
    <>
      <Sidebar className="isolate" isOpen={isSidebarOpen}>
        {/* Padding creates buffer for fixed `header` */}
        <main
          className="isolate px-200 pt-300 pb-[5.25rem] outline-none tablet:px-500 tablet:pt-500 tablet:pb-[6.625rem] desktop:pb-400"
          id="main"
          tabIndex={-1}
        >
          <div className="mx-auto max-w-[66.25rem]">{children}</div>
        </main>
        {dialog}
      </Sidebar>
    </>
  );
};

export default MainLayout;
