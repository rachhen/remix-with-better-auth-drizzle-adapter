import { useEffect, useState } from "react";
import { UAParser } from "ua-parser-js";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useSession } from "~/lib/auth-client";
import { Session } from "~/types/auth";
import { ActiveSessions } from "./active-sessions";
import { AlertEmailUnverified } from "./alert-email-unverified";
import { ChangePassword } from "./change-password";
import { EditUserDialog } from "./edit-user-dialog";
import { Passkeys } from "./passkeys";
import { SignOutButton } from "./sign-out-button";
import { UserProfile } from "./user-profile";

export function UserCard(props: {
  session: Session | null;
  activeSessions: Session["session"][];
}) {
  const { data } = useSession();
  const [, setUa] = useState<UAParser.UAParserInstance>();

  const session = data || props.session;

  useEffect(() => {
    setUa(new UAParser(session?.session.userAgent));
  }, [session?.session.userAgent]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>User</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8 grid-cols-1">
        <div className="flex items-start justify-between">
          <UserProfile session={session} />
          <EditUserDialog session={session} />
        </div>

        {session?.user.emailVerified ? null : (
          <AlertEmailUnverified session={session} />
        )}

        <ActiveSessions {...props} />
        <Passkeys session={props.session} />
      </CardContent>
      <CardFooter className="gap-2 justify-between items-center">
        <ChangePassword />
        <SignOutButton />
      </CardFooter>
    </Card>
  );
}
