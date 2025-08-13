FROM node:20-slim AS base

FROM base AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
COPY source.config.ts ./
COPY mdx-components.tsx ./
COPY content/ ./content/

RUN npm ci
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

ARG DATABASE_URL
ARG HOST_NAME
ARG ME_USER_ID
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG OPENAI_API_KEY
ARG MOCK_OPENAI
ARG EMAIL_SERVER_USER
ARG EMAIL_SERVER_PASSWORD
ARG EMAIL_SERVER_HOST
ARG EMAIL_SERVER_PORT
ARG EMAIL_FROM
ARG RESEND_AUDIENCE_ID
ARG CLOUDFLARE_ACCOUNT_ID
ARG CLOUDFLARE_ACCESS_KEY_ID
ARG CLOUDFLARE_SECRET_ACCESS_KEY
ARG CLOUDFLARE_BUCKET_NAME
ARG LEMONSQUEEZY_API_KEY
ARG LEMONSQUEEZY_STORE_ID
ARG LEMONSQUEEZY_VARIANT_ID
ARG LEMONSQUEEZY_WEBHOOK_SECRET
ARG LEMONSQUEEZY_WEBHOOK_URL
ARG LEMONSQUEEZY_STORE_STATUS
ARG NEXT_PUBLIC_POSTHOG_KEY
ARG NEXT_PUBLIC_POSTHOG_HOST

RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/drizzle ./drizzle
COPY --from=builder --chown=nextjs:nodejs /app/run.sh ./run.sh

RUN cd drizzle/migrate && npm i

WORKDIR /app

USER nextjs

EXPOSE 3000

ENV PORT=3000

ARG HOSTNAME

CMD ./run.sh