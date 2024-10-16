import { MailPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { organization } from "~/lib/auth-client";
import { ActiveOrganization } from "~/types/auth";

type Props = {
  setOptimisticOrg: (org: ActiveOrganization | null) => void;
  optimisticOrg: ActiveOrganization | null;
};
export function InviteMemberDialog({ setOptimisticOrg, optimisticOrg }: Props) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [loading, setLoading] = useState(false);

  async function handleInviteMember() {
    const invite = organization.inviteMember({
      email: email,
      role: role as "member",
      fetchOptions: {
        throw: true,
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: (ctx) => {
          if (optimisticOrg) {
            setOptimisticOrg({
              ...optimisticOrg,
              invitations: [...(optimisticOrg?.invitations || []), ctx.data],
            });
          }
        },
      },
    });

    toast.promise(invite, {
      loading: "Inviting member...",
      success: "Member invited successfully",
      error: (error) => error.error.message,
      finally() {
        setLoading(false);
      },
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full gap-2" variant="secondary">
          <MailPlus size={16} />
          <p>Invite Member</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-11/12">
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>
            Invite a member to your organization.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label>Email</Label>
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Label>Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="member">Member</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button disabled={loading} onClick={handleInviteMember}>
              {loading ? "Inviting..." : "Invite"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
