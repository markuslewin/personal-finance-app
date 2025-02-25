import "~/styles/globals.css";

import { type Metadata } from "next";
import { publicSans } from "~/app/_fonts";

// import { db } from "~/server/db";
// import { logOut } from "~/app/_actions";
// import { getSession } from "~/app/_auth";

import { type ReactNode } from "react";
import { cookies } from "next/headers";
import { getIsSidebarOpen } from "~/app/_sidebar";
import Sidebar from "~/app/_components/sidebar";

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
  const isSidebarOpen = getIsSidebarOpen(await cookies());

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
        <Sidebar isOpen={isSidebarOpen}>
          {/* Padding creates buffer for fixed `header` */}
          <main className="isolate px-200 pb-[5.25rem] pt-300 tablet:px-500 tablet:pb-[6.625rem] tablet:pt-500 desktop:pb-400">
            <div className="mx-auto max-w-[66.25rem]">{children}</div>
          </main>
        </Sidebar>
        {dialog}
      </body>
    </html>
  );
}
