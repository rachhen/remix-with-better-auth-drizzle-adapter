import "@fontsource/geist-mono";
import "@fontsource/geist-sans";
import "./tailwind.css";

import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import clsx from "clsx";
import {
  PreventFlashOnWrongTheme,
  ThemeProvider,
  useTheme,
} from "remix-themes";

import { Toaster } from "./components/ui/sonner";
import { Wrapper } from "./components/wrapper";
import { themeSessionResolver } from "./utils/theme.server";

export const links: LinksFunction = () => [];

// Return the theme from the session storage using the loader
export async function loader({ request }: LoaderFunctionArgs) {
  const { getTheme } = await themeSessionResolver(request);

  return {
    theme: getTheme(),
  };
}

function Document({
  ssrTheme,
  children,
}: {
  ssrTheme: boolean;
  children: React.ReactNode;
}) {
  const [theme] = useTheme();

  return (
    <html lang="en" className={clsx(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={ssrTheme} />
        <Links />
      </head>
      <body suppressHydrationWarning={true}>
        {children}
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();

  return (
    <ThemeProvider specifiedTheme={data?.theme} themeAction="/resources/theme">
      <Document ssrTheme={Boolean(data?.theme)}>{children}</Document>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <Wrapper>
      <Outlet />
    </Wrapper>
  );
}
