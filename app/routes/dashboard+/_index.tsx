import {
  json,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { OrganizationCard } from "~/features/dashboard/components/organization-card";
import { UserCard } from "~/features/dashboard/components/user-card";
import { auth } from "~/lib/auth.server";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Dashboard",
      description: "Dashboard of the application",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return redirect("/sign-in");
  }

  const activeSessions = await auth.api.listSessions({
    headers: request.headers,
  });

  return json({ session, activeSessions });
};

function Dashboard() {
  const { session, activeSessions } = useLoaderData<typeof loader>();

  return (
    <div className="w-full">
      <div className="flex gap-4 flex-col">
        <UserCard
          session={JSON.parse(JSON.stringify(session))}
          activeSessions={JSON.parse(JSON.stringify(activeSessions))}
        />
        <OrganizationCard session={JSON.parse(JSON.stringify(session))} />
      </div>
    </div>
  );
}

export default Dashboard;
