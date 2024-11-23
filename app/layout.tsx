import { Toaster } from "@/components/ui/toaster";
import Provider from "@/provider";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "@fontsource/fira-code";
import "./globals.css";
// import { Fira_Code } from "next/font/google";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
// const firaCode = Fira_Code({
//   display: "swap",
//   weight: ["300", "400", "500", "600"],
// });

export const metadata: Metadata = {
  title: "Live interviewer",
  description:
    "The interview experience, get detailed summary after each call.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>{children}</Provider>
        {/* {children} */}
        <Toaster />
      </body>
    </html>
  );
}
