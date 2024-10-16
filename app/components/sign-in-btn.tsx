import { Link } from "@remix-run/react";

import { Loader2 } from "lucide-react";
import { useSession } from "~/lib/auth-client";
import { Button } from "./ui/button";

export function SignInButton() {
  const { data, isPending } = useSession();

  if (isPending) {
    return <SignInFallback />;
  }

  return (
    <Button className="gap-2  justify-between" variant="default" asChild>
      <Link
        to={data?.session ? "/dashboard" : "/sign-in"}
        className="flex justify-center"
      >
        {!data?.session ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.2em"
            height="1.2em"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M5 3H3v4h2V5h14v14H5v-2H3v4h18V3zm12 8h-2V9h-2V7h-2v2h2v2H3v2h10v2h-2v2h2v-2h2v-2h2z"
            ></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.2em"
            height="1.2em"
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="M2 3h20v18H2zm18 16V7H4v12z"></path>
          </svg>
        )}
        <span>{data?.session ? "Dashboard" : "Sign In"}</span>
      </Link>
    </Button>
  );
}

export function SignInFallback() {
  return (
    <Button className="gap-2  justify-between" variant="default">
      <Loader2 /> Loading...
    </Button>
  );
}
