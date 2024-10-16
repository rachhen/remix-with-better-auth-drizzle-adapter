import { Loader2, QrCodeIcon, ShieldCheck, ShieldOff } from "lucide-react";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import CopyButton from "~/components/ui/copy-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { PasswordInput } from "~/components/ui/password-input";
import { authClient, useSession } from "~/lib/auth-client";
import { Session } from "~/types/auth";
import { AddPasskey } from "./add-passkey";
import { ListPasskeys } from "./list-passkeys";

type Props = {
  session: Session | null;
};

export function Passkeys(props: Props) {
  const { data } = useSession();
  const [qr, setQr] = useState<{ totpURI: string }>();
  const [isPendingTwoFa, setIsPendingTwoFa] = useState<boolean>(false);
  const [twoFaPassword, setTwoFaPassword] = useState<string>("");
  const [twoFactorDialog, setTwoFactorDialog] = useState<boolean>(false);

  const session = data || props.session;

  async function handleToggleTwoFactor() {
    if (twoFaPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setIsPendingTwoFa(true);
    if (session?.user.twoFactorEnabled) {
      await authClient.twoFactor.disable({
        password: twoFaPassword,
        fetchOptions: {
          onError(context) {
            toast.error(context.error.message);
          },
          onSuccess() {
            toast("2FA disabled successfully");
            setTwoFactorDialog(false);
          },
        },
      });
    } else {
      await authClient.twoFactor.enable({
        password: twoFaPassword,
        fetchOptions: {
          onError(context) {
            toast.error(context.error.message);
          },
          onSuccess() {
            toast.success("2FA enabled successfully");
            setTwoFactorDialog(false);
          },
        },
      });
    }
    setIsPendingTwoFa(false);
    setTwoFaPassword("");
  }

  useEffect(() => {
    const getQr = async () => {
      console.log(
        "session?.user.twoFactorEnabled",
        session?.user.twoFactorEnabled
      );
      if (session?.user.twoFactorEnabled) {
        const res = await authClient.twoFactor.getTotpUri();
        if (res.error) {
          throw res.error;
        }
        console.log(res.data);
        setQr(res.data);
        return res.data;
      }
    };

    getQr();
  }, [session?.user.twoFactorEnabled]);

  return (
    <div className="border-y py-4 flex items-center flex-wrap justify-between gap-2">
      <div className="flex flex-col gap-2">
        <p className="text-sm">Passkeys</p>
        <div className="flex gap-2 flex-wrap">
          <AddPasskey />
          <ListPasskeys />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm">Two Factor</p>
        <div className="flex gap-2">
          {!!session?.user.twoFactorEnabled && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <QrCodeIcon size={16} />
                  <span className="md:text-sm text-xs">Scan QR Code</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] w-11/12">
                <DialogHeader>
                  <DialogTitle>Scan QR Code</DialogTitle>
                  <DialogDescription>
                    Scan the QR code with your TOTP app
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-center">
                  <QRCode value={qr?.totpURI || ""} />
                </div>
                <div className="flex gap-2 items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    Copy URI to clipboard
                  </p>
                  <CopyButton textToCopy={qr?.totpURI || ""} />
                </div>
              </DialogContent>
            </Dialog>
          )}
          <Dialog open={twoFactorDialog} onOpenChange={setTwoFactorDialog}>
            <DialogTrigger asChild>
              <Button
                variant={
                  session?.user.twoFactorEnabled ? "destructive" : "outline"
                }
                className="gap-2"
              >
                {session?.user.twoFactorEnabled ? (
                  <ShieldOff size={16} />
                ) : (
                  <ShieldCheck size={16} />
                )}
                <span className="md:text-sm text-xs">
                  {session?.user.twoFactorEnabled
                    ? "Disable 2FA"
                    : "Enable 2FA"}
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] w-11/12">
              <DialogHeader>
                <DialogTitle>
                  {session?.user.twoFactorEnabled
                    ? "Disable 2FA"
                    : "Enable 2FA"}
                </DialogTitle>
                <DialogDescription>
                  {session?.user.twoFactorEnabled
                    ? "Disable the second factor authentication from your account"
                    : "Enable 2FA to secure your account"}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <PasswordInput
                  id="password"
                  placeholder="Password"
                  value={twoFaPassword}
                  onChange={(e) => setTwoFaPassword(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button
                  disabled={isPendingTwoFa}
                  onClick={handleToggleTwoFactor}
                >
                  {isPendingTwoFa ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : session?.user.twoFactorEnabled ? (
                    "Disable 2FA"
                  ) : (
                    "Enable 2FA"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
