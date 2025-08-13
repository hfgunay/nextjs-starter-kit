import * as React from "react";
import { BaseEmail, EmailButton, EmailText, EmailSecondaryText } from "./components/base-email";
import { applicationName } from "@/app-config";
import { env } from "@/env";

export const BASE_URL = env.HOST_NAME;

export function ResetPasswordEmail({ token }: { token: string }) {
  return (
    <BaseEmail
      previewText={`Reset your password for ${applicationName}`}
      title="Reset Your Password"
    >
      <EmailText>
        We received a request to reset your password for your {applicationName} account. Click the button below to set a new password. This link will expire in 24 hours.
      </EmailText>

      <EmailButton href={`${BASE_URL}/reset-password?token=${token}`}>
        Reset Password
      </EmailButton>

      <EmailSecondaryText>
        If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
      </EmailSecondaryText>
    </BaseEmail>
  );
}
