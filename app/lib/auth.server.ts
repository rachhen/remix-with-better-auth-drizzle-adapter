import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  admin,
  bearer,
  organization,
  passkey,
  twoFactor,
} from "better-auth/plugins";

import { db } from "./db";
import * as schema from "./db/schema";
import { reactInvitationEmail } from "./email/invitation";
import { resend } from "./email/resend.server";
import { reactResetPasswordEmail } from "./email/rest-password";

const from = process.env.BETTER_AUTH_EMAIL || "delivered@resend.dev";
const to = process.env.TEST_EMAIL || "";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
    // usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
    sendEmailVerificationOnSignUp: true,
    async sendResetPassword(url, user) {
      await resend.emails.send({
        from,
        to: user.email,
        subject: "Reset your BetterAuth password",
        react: reactResetPasswordEmail({
          username: user.email,
          resetLink: url,
        }),
      });
    },
    async sendVerificationEmail(url, user) {
      console.log("Sending verification email to", user.email);
      const res = await resend.emails.send({
        from,
        to: to || user.email,
        subject: "Verify your email address",
        html: `<a href="${url}">Verify your email address</a>`,
      });
      console.log(res, user.email);
    },
  },
  socialProviders: {
    // github: {
    //   clientId: process.env.GITHUB_CLIENT_ID || "",
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    // },
    // google: {
    //   clientId: process.env.GOOGLE_CLIENT_ID || "",
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    // },
    // discord: {
    //   clientId: process.env.DISCORD_CLIENT_ID || "",
    //   clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
    // },
    // microsoft: {
    //   clientId: process.env.MICROSOFT_CLIENT_ID || "",
    //   clientSecret: process.env.MICROSOFT_CLIENT_SECRET || "",
    // },
  },
  plugins: [
    admin(),
    passkey(),
    bearer(),
    organization({
      async sendInvitationEmail(data) {
        const res = await resend.emails.send({
          from,
          to: data.email,
          subject: "You've been invited to join an organization",
          react: reactInvitationEmail({
            username: data.email,
            invitedByUsername: data.inviter.user.name,
            invitedByEmail: data.inviter.user.email,
            teamName: data.organization.name,
            inviteLink:
              process.env.NODE_ENV === "development"
                ? `http://localhost:3000/accept-invitation/${data.id}`
                : `https://${
                    process.env.NEXT_PUBLIC_APP_URL ||
                    process.env.VERCEL_URL ||
                    process.env.BETTER_AUTH_URL
                  }/accept-invitation/${data.id}`,
          }),
        });
        console.log(res, data.email);
      },
    }),
    twoFactor({
      otpOptions: {
        async sendOTP(user, otp) {
          await resend.emails.send({
            from,
            to: user.email,
            subject: "Your OTP",
            html: `Your OTP is ${otp}`,
          });
        },
      },
    }),
  ],
});
