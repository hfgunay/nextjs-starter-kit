import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const accountTypeEnum = pgEnum("type", ["email", "google", "github"]);

export const users = pgTable("gf_user", {
  id: serial("id").primaryKey(),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  credits: integer("credits").notNull().default(10),
});

export const accounts = pgTable(
  "gf_accounts",
  {
    id: serial("id").primaryKey(),
    userId: serial("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accountType: accountTypeEnum("accountType").notNull(),
    githubId: text("githubId").unique(),
    googleId: text("googleId").unique(),
    password: text("password"),
    salt: text("salt"),
  },
  (table) => ({
    userIdAccountTypeIdx: index("user_id_account_type_idx").on(
      table.userId,
      table.accountType
    ),
  })
);

export const profiles = pgTable("gf_profile", {
  id: serial("id").primaryKey(),
  userId: serial("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  displayName: text("displayName"),
  imageId: text("imageId"),
  image: text("image"),
});

export const magicLinks = pgTable(
  "gf_magic_links",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull().unique(),
    token: text("token"),
    tokenExpiresAt: timestamp("tokenExpiresAt", { mode: "date" }),
  },
  (table) => ({
    tokenIdx: index("magic_links_token_idx").on(table.token),
  })
);

export const resetTokens = pgTable(
  "gf_reset_tokens",
  {
    id: serial("id").primaryKey(),
    userId: serial("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .unique(),
    token: text("token"),
    tokenExpiresAt: timestamp("tokenExpiresAt", { mode: "date" }),
  },
  (table) => ({
    tokenIdx: index("reset_tokens_token_idx").on(table.token),
  })
);

export const verifyEmailTokens = pgTable(
  "gf_verify_email_tokens",
  {
    id: serial("id").primaryKey(),
    userId: serial("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .unique(),
    token: text("token"),
    tokenExpiresAt: timestamp("tokenExpiresAt", { mode: "date" }),
  },
  (table) => ({
    tokenIdx: index("verify_email_tokens_token_idx").on(table.token),
  })
);

export const sessions = pgTable(
  "gf_session",
  {
    id: text("id").primaryKey(),
    userId: serial("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
  },
  (table) => ({
    userIdIdx: index("sessions_user_id_idx").on(table.userId),
  })
);

/**
 * newsletters - although the emails for the newsletter are tracked in Resend, it's beneficial to also track
 * sign ups in your own database in case you decide to move to another email provider.
 * The last thing you'd want is for your email list to get lost due to a
 * third party provider shutting down or dropping your data.
 */
export const newsletters = pgTable("gf_newsletter", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
});

/** Generated Images Table */
export const generatedImages = pgTable("fa_generated_images", {
  id: serial("id").primaryKey(),
  userId: serial("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  imageUrl: text("imageUrl").notNull(),
  prompt: text("prompt").notNull(),
  style: text("style").notNull().default("Realistic"),
  aiModel: text("aiModel").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

/** Generated Captions Table (One image → multiple captions) */
export const generatedCaptions = pgTable("fa_generated_captions", {
  id: serial("id").primaryKey(),
  userId: serial("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  imageId: integer("imageId")
    .notNull()
    .references(() => generatedImages.id, { onDelete: "cascade" }),
  caption: text("caption").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export const webhookEvents = pgTable('webhookEvent', {
  id: integer('id').primaryKey(),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  eventName: text('eventName').notNull(),
  processed: boolean('processed').default(false),
  body: jsonb('body').notNull(),
  processingError: text('processingError'),
})

/**
 * RELATIONSHIPS
 *
 * Here you can define drizzle relationships between table which helps improve the type safety
 * in your code.
 */

/** Relationships */
export const generatedImagesRelations = relations(generatedImages, ({ one, many }) => ({
  user: one(users, { fields: [generatedImages.userId], references: [users.id] }),
  captions: many(generatedCaptions),
}));

export const generatedCaptionsRelations = relations(generatedCaptions, ({ one }) => ({
  user: one(users, { fields: [generatedCaptions.userId], references: [users.id] }),
  image: one(generatedImages, { fields: [generatedCaptions.imageId], references: [generatedImages.id] }),
}));

/**
 * TYPES
 *
 * You can create and export types from your schema to use in your application.
 * This is useful when you need to know the shape of the data you are working with
 * in a component or function.
 */
export type User = typeof users.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type Session = typeof sessions.$inferSelect;

export type GeneratedImage = typeof generatedImages.$inferSelect;
export type NewGeneratedImage = typeof generatedImages.$inferInsert;

export type GeneratedCaption = typeof generatedCaptions.$inferSelect;
export type NewGeneratedCaption = typeof generatedCaptions.$inferInsert;

export type NewWebhookEvent = typeof webhookEvents.$inferInsert;
