import "~/styles/globals.css";

import { type Metadata } from "next";
import { publicSans } from "~/app/_fonts";

// import { db } from "~/server/db";
// import { logOut } from "~/app/_actions";
// import { getSession } from "~/app/_auth";

import { type ReactNode } from "react";
import { Html } from "~/app/_components/html";
import { ProgressBarProvider, ProgressBar } from "~/app/_components/progress";
import { AppEventProvider } from "~/app/_components/app-event";

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
}: Readonly<{ children: ReactNode }>) {
  // todo: What do we do here?
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
    <Html lang="en" className={`${publicSans.variable}`}>
      <AppEventProvider>
        <ProgressBarProvider>
          <body className="bg-grey-900 font-public-sans text-preset-4 text-white">
            {children}
            <ProgressBar />
          </body>
        </ProgressBarProvider>
      </AppEventProvider>
    </Html>
  );
}
