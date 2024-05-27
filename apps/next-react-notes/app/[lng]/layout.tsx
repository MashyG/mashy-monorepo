import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { type Locales, locales } from "@/config";
// import Link from "next/link";

export const metadata: Metadata = {
  title: "Next React Notes",
  description: "Next React Notes App",
};

export async function generateStaticParams() {
  return locales.map((lng) => ({ lng }));
}

export default function RootLayout({
  children,
  params: { lng },
}: Readonly<{
  children: React.ReactNode;
  params: { lng: Locales };
}>) {
  return (
    <html lang={lng}>
      <body>
        <div className="x-container">
          {/* <Link href="/client">Client Side Component</Link> */}
          <div className="main">
            <Sidebar lng={lng} />
            <section className="col note-viewer flex-1 overflow-auto">
              {children}
            </section>
          </div>
        </div>
      </body>
    </html>
  );
}
