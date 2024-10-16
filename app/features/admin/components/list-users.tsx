import { useNavigate } from "@remix-run/react";
import { Loader2, RefreshCw, Trash, UserCircle } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { authClient } from "~/lib/auth-client";
import { User } from "~/types/auth";
import { useAdminDashboard } from "../context/admin-dashboard";

type Props = {
  users: User[];
};
export function ListUsers({ users }: Props) {
  const navigate = useNavigate();
  const { loading, setLoading, setBanData, setIsBanDialogOpen } =
    useAdminDashboard();

  const handleDeleteUser = async (id: string) => {
    setLoading(`delete-${id}`);
    try {
      await authClient.admin.removeUser({ userId: id });
      toast.success("User deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    } finally {
      setLoading(undefined);
    }
  };

  const handleRevokeSessions = async (id: string) => {
    setLoading(`revoke-${id}`);
    try {
      await authClient.admin.revokeUserSessions({ userId: id });
      toast.success("Sessions revoked for user");
    } catch (error: any) {
      toast.error(error.message || "Failed to revoke sessions");
    } finally {
      setLoading(undefined);
    }
  };

  const handleImpersonateUser = async (id: string) => {
    setLoading(`impersonate-${id}`);
    try {
      await authClient.admin.impersonateUser({ userId: id });
      toast.success("Impersonated user");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to impersonate user");
    } finally {
      setLoading(undefined);
    }
  };

  const handleSetBan = async (user: User) => {
    setBanData({
      userId: user.id,
      reason: "",
      expirationDate: undefined,
    });
    if (user.banned) {
      setLoading(`ban-${user.id}`);
      await authClient.admin.unbanUser(
        {
          userId: user.id,
        },
        {
          onError(context) {
            toast.error(context.error.message || "Failed to unban user");
            setLoading(undefined);
          },
          onSuccess() {
            toast.success("User unbanned successfully");
            setLoading(undefined);
            navigate(0);
          },
        }
      );
    } else {
      setIsBanDialogOpen(true);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Banned</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users?.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.role || "user"}</TableCell>
            <TableCell>
              {user.banned ? (
                <Badge variant="destructive">Yes</Badge>
              ) : (
                <Badge variant="outline">No</Badge>
              )}
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteUser(user.id)}
                  disabled={loading?.startsWith("delete")}
                >
                  {loading === `delete-${user.id}` ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRevokeSessions(user.id)}
                  disabled={loading?.startsWith("revoke")}
                >
                  {loading === `revoke-${user.id}` ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleImpersonateUser(user.id)}
                  disabled={loading?.startsWith("impersonate")}
                >
                  {loading === `impersonate-${user.id}` ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <UserCircle className="h-4 w-4 mr-2" />
                      Impersonate
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSetBan(user)}
                  disabled={loading?.startsWith("ban")}
                >
                  {loading === `ban-${user.id}` ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : user.banned ? (
                    "Unban"
                  ) : (
                    "Ban"
                  )}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
