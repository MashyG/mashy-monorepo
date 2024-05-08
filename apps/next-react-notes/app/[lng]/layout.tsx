import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { type Locales, locales } from "@/config";

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
