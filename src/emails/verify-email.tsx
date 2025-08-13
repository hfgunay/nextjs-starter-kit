import * as React from "react";
import { BaseEmail, EmailButton, EmailText, EmailSecondaryText } from "./components/base-email";
import { applicationName } from "@/app-config";
import { env } from "@/env";

export const BASE_URL = env.HOST_NAME;

export function VerifyEmail({ token }: { token: string }) {
  return (
    <BaseEmail
      previewText="Verify your Email Address"
      title="Verify Your Email Address"
    >
      <EmailText>
        Thanks for signing up! Please verify your email address by clicking the button below. This helps us ensure the security of your account.
      </EmailText>

      <EmailButton href={`${BASE_URL}/api/login/verify-email?token=${token}`}>
        Verify Email Address
      </EmailButton>

      <EmailSecondaryText>
        If you didn't create an account with {applicationName}, you can safely ignore this email.
      </EmailSecondaryText>
    </BaseEmail>
  );
}
