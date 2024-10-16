import { authClient } from "~/lib/auth-client";
import type { auth } from "~/lib/auth.server";

export type Session = typeof auth.$Infer.Session;
export type ActiveOrganization = typeof authClient.$Infer.ActiveOrganization;
export type Invitation = typeof authClient.$Infer.Invitation;
export type User = Session["user"];
