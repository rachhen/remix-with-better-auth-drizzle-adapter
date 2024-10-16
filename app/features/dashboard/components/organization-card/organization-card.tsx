import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useActiveOrganization, useSession } from "~/lib/auth-client";
import { ActiveOrganization, Session } from "~/types/auth";
import { CreateOrganizationDialog } from "./create-organization-dialog";
import { InviteMemberDialog } from "./invite-member-dialog";
import { Invites } from "./invites";
import { Members } from "./members";
import { OrganizationDropdown } from "./organization-dropdown";

export function OrganizationCard(props: { session: Session | null }) {
  const activeOrg = useActiveOrganization();
  const [optimisticOrg, setOptimisticOrg] = useState<ActiveOrganization | null>(
    null
  );

  useEffect(() => {
    setOptimisticOrg(activeOrg.data);
  }, [activeOrg.data]);

  const { data } = useSession();
  const session = data || props.session;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization</CardTitle>
        <div className="flex justify-between">
          <OrganizationDropdown
            optimisticOrg={optimisticOrg}
            setOptimisticOrg={setOptimisticOrg}
          />
          <div>
            <CreateOrganizationDialog />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Avatar className="rounded-none">
            <AvatarImage
              className="object-cover w-full h-full rounded-none"
              src={optimisticOrg?.logo || ""}
            />
            <AvatarFallback className="rounded-none">
              {optimisticOrg?.name?.charAt(0) || "P"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p>{optimisticOrg?.name || "Personal"}</p>
            <p className="text-xs text-muted-foreground">
              {optimisticOrg?.members.length || 1} members
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-8 flex-col md:flex-row">
          <Members session={session} optimisticOrg={optimisticOrg} />
          <Invites
            optimisticOrg={optimisticOrg}
            setOptimisticOrg={setOptimisticOrg}
          />
        </div>
        <div className="flex justify-end w-full mt-4">
          <div>
            <div>
              {optimisticOrg?.id && (
                <InviteMemberDialog
                  setOptimisticOrg={setOptimisticOrg}
                  optimisticOrg={optimisticOrg}
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
