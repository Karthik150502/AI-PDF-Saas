import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

import { montserrat200, montserrat300, montserrat400 } from "@/fonts/montserrat";
import clsx from "clsx";
import Provider from "@/components/ui/provider";
import { Toaster } from "react-hot-toast"
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "PDF AI Assistance Bot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <Provider>
        <html lang="en">
          <body className={clsx(montserrat300.className, "w-screen min-h-screen overflow-hidden overflow-x-hidden overflow-y-hidden")}>
            {children}
            <Toaster />
            <ShadcnToaster />
          </body>
        </html>
      </Provider>
    </ClerkProvider>
  );
}
