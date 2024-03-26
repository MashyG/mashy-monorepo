import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Study Next App",
  description: "Generated by create next app",
};

export default function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
    left: React.ReactNode;
    right: React.ReactNode;
  }>
) {
  const { children, left, right } = props;
  return (
    <html>
      <body className="p-6">
        <nav className="flex items-center justify-center gap-10 text-blue-600 mb-6">
          <Link href="/">to home</Link>
          <br />
          <Link href="/one">to left/one</Link>
          <br />
          <Link href="/two">to left/two</Link>
        </nav>
        <div className="flex gap-6">
          {left}
          {right}
        </div>
        {children}
      </body>
    </html>
  );
}
