import * as React from "react";
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { env } from "@/env";
import { applicationName } from "@/app-config";

export const BASE_URL = env.HOST_NAME;

interface BaseEmailProps {
  previewText: string;
  title: string;
  children: React.ReactNode;
}

export function BaseEmail({ previewText, title, children }: BaseEmailProps) {
  const currentYear = new Date().getFullYear();
  
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <React.Fragment>
          <Body className="bg-[#f5f5f5] my-auto mx-auto font-sans min-h-screen">
            <Container className="my-[40px] mx-auto p-[20px] max-w-[600px]">
              <Section className="mt-[32px]">
                <Link href={BASE_URL}>
                  <Img
                    src={`${BASE_URL}/logo.png`}
                    width="180"
                    height="180"
                    alt={applicationName}
                    className="my-0 mx-auto"
                  />
                </Link>
              </Section>

              <Section className="mt-[32px] mb-[32px] text-center">
                <Text className="text-black font-bold text-[32px] leading-[40px] mb-4">
                  {title}
                </Text>

                {children}
              </Section>

              <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

              <Text className="text-[#666666] text-[12px] leading-[24px]">
                © {currentYear} {applicationName}.
              </Text>
              <Text className="text-[#666666] text-[12px] leading-[24px]">
                This email was sent from {applicationName}, an AI image generation tool.
              </Text>
            </Container>
          </Body>
        </React.Fragment>
      </Tailwind>
    </Html>
  );
}

interface EmailButtonProps {
  href: string;
  children: React.ReactNode;
}

export function EmailButton({ href, children }: EmailButtonProps) {
  return (
    <Text className="text-center">
      <Link
        href={href}
        target="_blank"
        className="bg-[#B347FF] hover:bg-[#9F40E6] text-white shadow-lg hover:shadow-xl transition-all px-8 py-4 rounded-md no-underline inline-block text-[16px] font-semibold"
      >
        {children}
      </Link>
    </Text>
  );
}

export function EmailText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <Text className={`text-black text-[16px] leading-[24px] mb-8 ${className}`}>
      {children}
    </Text>
  );
}

export function EmailSecondaryText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <Text className={`text-[#666666] text-[14px] leading-[24px] mt-8 ${className}`}>
      {children}
    </Text>
  );
} 