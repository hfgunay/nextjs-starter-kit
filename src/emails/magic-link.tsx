import * as React from "react";
import { BaseEmail, EmailButton, EmailText, EmailSecondaryText } from "./components/base-email";
import { applicationName } from "@/app-config";
import { env } from "@/env";

export const BASE_URL = env.HOST_NAME;

export function MagicLinkEmail({ token }: { token: string }) {
  const previewText = `Your magic login link for ${applicationName}`;
  
  return (
    <BaseEmail
      previewText={previewText}
      title="Your Magic Login Link"
    >
      <EmailText>
        Use the magic link below to securely log in to your {applicationName} account. This link will expire in 24 hours.
      </EmailText>

      <EmailButton href={`${BASE_URL}/api/login/magic?token=${token}`}>
        Login using Magic Link
      </EmailButton>

      <EmailSecondaryText>
        If you didn't request this login link, you can safely ignore this email. The link will expire automatically.
      </EmailSecondaryText>
    </BaseEmail>
  );
}
