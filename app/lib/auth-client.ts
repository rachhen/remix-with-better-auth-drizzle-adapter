import {
  adminClient,
  organizationClient,
  passkeyClient,
  twoFactorClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";

export const authClient = createAuthClient({
  fetchOptions: {
    onError(e) {
      if (e.error.status === 429) {
        toast.error("Too many requests. Please try again later.");
      }
    },
  },

  plugins: [
    adminClient(),
    organizationClient(),
    passkeyClient(),
    adminClient(),
    twoFactorClient({
      redirect: true,
      twoFactorPage: "/two-factor",
    }),
  ],
});

export const {
  signIn,
  signUp,
  user,
  organization,
  signOut,
  useSession,
  useActiveOrganization,
  useListOrganizations,
} = authClient;
