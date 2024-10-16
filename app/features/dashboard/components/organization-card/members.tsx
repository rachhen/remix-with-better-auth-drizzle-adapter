import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { organization } from "~/lib/auth-client";
import { ActiveOrganization, Session } from "~/types/auth";

type Props = {
  session: Session | null;
  optimisticOrg: ActiveOrganization | null;
};
export function Members({ session, optimisticOrg }: Props) {
  const currentMember = optimisticOrg?.members.find(
    (member) => member.userId === session?.user.id
  );

  return (
    <div className="flex flex-col gap-2 flex-grow">
      <p className="font-medium border-b-2 border-b-foreground/10">Members</p>
      <div className="flex flex-col gap-2">
        {optimisticOrg?.members.map((member) => (
          <div key={member.id} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Avatar className="sm:flex w-9 h-9">
                <AvatarImage src={member.user.image} className="object-cover" />
                <AvatarFallback>{member.user.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm">{member.user.name}</p>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </div>
            </div>
            {member.role !== "owner" &&
              (currentMember?.role === "owner" ||
                currentMember?.role === "admin") && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    organization.removeMember({
                      memberIdOrEmail: member.id,
                    });
                  }}
                >
                  {currentMember?.id === member.id ? "Leave" : "Remove"}
                </Button>
              )}
          </div>
        ))}
        {!optimisticOrg?.id && (
          <div>
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={session?.user.image} />
                <AvatarFallback>{session?.user.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm">{session?.user.name}</p>
                <p className="text-xs text-muted-foreground">Owner</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
