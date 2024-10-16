import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

import { auth } from "~/lib/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  return auth.handler(request);
}

export async function action({ request }: ActionFunctionArgs) {
  return auth.handler(request);
}
