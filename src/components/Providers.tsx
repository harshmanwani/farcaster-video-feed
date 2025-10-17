'use client';

import { NeynarContextProvider, Theme } from "@neynar/react";
import "@neynar/react/dist/style.css";
import { useTheme } from "./ThemeProvider";
import { useEffect, useState } from "react";

function NeynarProviderWithTheme({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const [neynarTheme, setNeynarTheme] = useState<Theme>(Theme.Light);

  useEffect(() => {
    if (theme === "dark") {
      setNeynarTheme(Theme.Dark);
    } else if (theme === "light") {
      setNeynarTheme(Theme.Light);
    } else {
      // System theme
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setNeynarTheme(isDark ? Theme.Dark : Theme.Light);
    }
  }, [theme]);

  return (
    <NeynarContextProvider
      settings={{
        clientId: process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID || "",
        defaultTheme: neynarTheme,
      }}
    >
      {children}
    </NeynarContextProvider>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return <NeynarProviderWithTheme>{children}</NeynarProviderWithTheme>;
}

