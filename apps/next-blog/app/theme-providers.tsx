"use client";

import { ThemeProvider } from "next-themes";

export function ThemeProviders({ children }: React.PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
    </ThemeProvider>
  );
}
