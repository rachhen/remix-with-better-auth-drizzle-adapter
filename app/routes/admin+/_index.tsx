/* eslint-disable @typescript-eslint/no-explicit-any */
import { json, LoaderFunctionArgs } from "@remix-run/node";
import {
  ClientLoaderFunctionArgs,
  isRouteErrorResponse,
  redirect,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";

import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { BanUser } from "~/features/admin/components/ban-user";
import { CreateUser } from "~/features/admin/components/create-user";
import { ListUsers } from "~/features/admin/components/list-users";
import { AdminDashboardProvider } from "~/features/admin/context/admin-dashboard";
import { authClient } from "~/lib/auth-client";
import { auth } from "~/lib/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return redirect("/sign-in");
  }

  if (session.user.role !== "admin") {
    throw new Response("Only admins can access this page", { status: 403 });
  }

  return json({ test: "test" });
};

export const clientLoader = async ({
  serverLoader,
}: ClientLoaderFunctionArgs) => {
  const sl = await serverLoader<typeof loader>();
  const { data } = await authClient.admin.listUsers({
    query: {
      limit: 10,
      sortBy: "createdAt",
      sortDirection: "desc",
    },
  });

  return { users: data?.users ?? [], ...sl };
};
clientLoader.hydrate = true;

export function HydrateFallback() {
  return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}

export default function AdminDashboard() {
  const { users } = useLoaderData<typeof clientLoader>();

  return (
    <AdminDashboardProvider>
      <div className="container mx-auto p-4 space-y-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
            <CreateUser />
            <BanUser />
          </CardHeader>
          <CardContent>
            <ListUsers users={users} />
          </CardContent>
        </Card>
      </div>
    </AdminDashboardProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {error.status} {error.statusText}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error.data}</p>
        </CardContent>
      </Card>
    );
  } else if (error instanceof Error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error.message}</p>
          <p>The stack trace is:</p>
          <pre>{error.stack}</pre>
        </CardContent>
      </Card>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
