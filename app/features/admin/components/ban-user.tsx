import { useNavigate } from "@remix-run/react";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { authClient } from "~/lib/auth-client";
import { cn } from "~/lib/utils";
import { useAdminDashboard } from "../context/admin-dashboard";

export function BanUser() {
  const navigate = useNavigate();
  const {
    loading,
    banData,
    isBanDialogOpen,
    setLoading,
    setBanData,
    setIsBanDialogOpen,
  } = useAdminDashboard();

  const handleBanUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(`ban-${banData.userId}`);
    try {
      if (!banData.expirationDate) {
        throw new Error("Expiration date is required");
      }
      const res = await authClient.admin.banUser({
        userId: banData.userId,
        banReason: banData.reason,
        banExpiresIn: banData.expirationDate.getTime() - new Date().getTime(),
      });
      if (res.error) {
        throw res.error;
      }

      toast.success("User banned successfully");
      setIsBanDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to ban user");
    } finally {
      setLoading(undefined);
      navigate(0);
    }
  };

  return (
    <Dialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ban User</DialogTitle>
          <DialogDescription>Ban a user from the platform</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleBanUser} className="space-y-4">
          <div>
            <Label htmlFor="reason">Reason</Label>
            <Input
              id="reason"
              value={banData.reason}
              onChange={(e) =>
                setBanData({ ...banData, reason: e.target.value })
              }
              required
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="expirationDate">Expiration Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="expirationDate"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !banData.expirationDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {banData.expirationDate ? (
                    format(banData.expirationDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={banData.expirationDate}
                  onSelect={(date) =>
                    setBanData({ ...banData, expirationDate: date })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading?.startsWith("ban")}
          >
            {loading === `ban-${banData.userId}` ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Banning...
              </>
            ) : (
              "Ban User"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
