import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth-client";
import { Session } from "~/types/auth";

type Props = {
  session: Session | null;
};

export function AlertEmailUnverified({ session }: Props) {
  const [emailVerificationPending, setEmailVerificationPending] =
    useState<boolean>(false);

  async function handleSendVerificationEmail() {
    await authClient.sendVerificationEmail(
      {
        email: session?.user.email || "",
      },
      {
        onRequest() {
          setEmailVerificationPending(true);
        },
        onError(context) {
          toast.error(context.error.message);
          setEmailVerificationPending(false);
        },
        onSuccess() {
          toast.success("Verification email sent successfully");
          setEmailVerificationPending(false);
        },
      }
    );
  }

  return (
    <Alert>
      <AlertTitle>Verify Your Email Address</AlertTitle>
      <AlertDescription className="text-muted-foreground">
        Please verify your email address. Check your inbox for the verification
        email. If you haven&apos;t received the email, click the button below to
        resend.
      </AlertDescription>
      <Button
        size="sm"
        variant="secondary"
        className="mt-2"
        onClick={handleSendVerificationEmail}
      >
        {emailVerificationPending ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          "Resend Verification Email"
        )}
      </Button>
    </Alert>
  );
}
