import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import CopyButton from "~/components/ui/copy-button";
import { Label } from "~/components/ui/label";
import { organization } from "~/lib/auth-client";

import { ActiveOrganization, Invitation } from "~/types/auth";

type Props = {
  optimisticOrg: ActiveOrganization | null;
  setOptimisticOrg: (org: ActiveOrganization | null) => void;
};
export function Invites({
  optimisticOrg,
  setOptimisticOrg,
}: Props): React.ReactNode {
  const [isRevoking, setIsRevoking] = useState<string[]>([]);

  function handleRevokeInvite(invitation: Invitation) {
    organization.cancelInvitation(
      {
        invitationId: invitation.id,
      },
      {
        onRequest: () => {
          setIsRevoking([...isRevoking, invitation.id]);
        },
        onSuccess: () => {
          toast.message("Invitation revoked successfully");
          setIsRevoking(isRevoking.filter((id) => id !== invitation.id));
          if (optimisticOrg) {
            setOptimisticOrg({
              ...optimisticOrg,
              invitations: optimisticOrg.invitations.filter(
                (inv) => inv.id !== invitation.id
              ),
            });
          }
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
          setIsRevoking(isRevoking.filter((id) => id !== invitation.id));
        },
      }
    );
  }

  const inviteVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 },
  };

  return (
    <div className="flex flex-col gap-2 flex-grow">
      <p className="font-medium border-b-2 border-b-foreground/10">Invites</p>
      <div className="flex flex-col gap-2">
        <AnimatePresence>
          {optimisticOrg?.invitations
            .filter((invitation) => invitation.status === "pending")
            .map((invitation) => (
              <motion.div
                key={invitation.id}
                className="flex items-center justify-between"
                variants={inviteVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
              >
                <div>
                  <p className="text-sm">{invitation.email}</p>
                  <p className="text-xs text-muted-foreground">
                    {invitation.role}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    disabled={isRevoking.includes(invitation.id)}
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRevokeInvite(invitation)}
                  >
                    {isRevoking.includes(invitation.id) ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      "Revoke"
                    )}
                  </Button>
                  <div>
                    <CopyButton
                      textToCopy={`${window.location.origin}/accept-invitation/${invitation.id}`}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
        </AnimatePresence>
        {optimisticOrg?.invitations.length === 0 && (
          <motion.p
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            No Active Invitations
          </motion.p>
        )}
        {!optimisticOrg?.id && (
          <Label className="text-xs text-muted-foreground">
            You can&apos;t invite members to your personal workspace.
          </Label>
        )}
      </div>
    </div>
  );
}
