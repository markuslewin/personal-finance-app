import "~/styles/globals.css";

import { type Metadata } from "next";
import { publicSans } from "~/app/_fonts";

export const metadata: Metadata = {
  title: "finance",
  description: "A personal fincance app.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${publicSans.variable}`}>
      <body className="font-public-sans bg-beige-100 text-grey-900">
        {children}
      </body>
    </html>
  );
}
