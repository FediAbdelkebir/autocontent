import { pgTable, text, serial, integer, timestamp, jsonb, boolean, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// Content Sources table
export const contentSources = pgTable("content_sources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // RSS, API, etc.
  url: text("url").notNull(),
  apiKey: text("api_key"),
  isActive: boolean("is_active").default(true),
  lastFetched: timestamp("last_fetched"),
  fetchInterval: integer("fetch_interval").default(60), // minutes
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const contentSourceSchema = createInsertSchema(contentSources, {
  name: (schema) => schema.min(2, "Name must be at least 2 characters long"),
  url: (schema) => schema.url("Must be a valid URL")
});

export type ContentSource = typeof contentSources.$inferSelect;
export type ContentSourceInsert = z.infer<typeof contentSourceSchema>;

// Video Templates table
export const videoTemplates = pgTable("video_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // countdown, trailer, news, etc.
  makeConfig: jsonb("make_config").notNull(), // configuration for Make.com
  duration: integer("duration"), // in seconds
  aspectRatio: text("aspect_ratio").default("9:16"), // 9:16, 16:9, etc.
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const videoTemplateSchema = createInsertSchema(videoTemplates, {
  name: (schema) => schema.min(2, "Name must be at least 2 characters long")
});

export type VideoTemplate = typeof videoTemplates.$inferSelect;
export type VideoTemplateInsert = z.infer<typeof videoTemplateSchema>;

// Content items table
export const contentItems = pgTable("content_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  sourceId: integer("source_id").references(() => contentSources.id),
  originalUrl: text("original_url"),
  thumbnailUrl: text("thumbnail_url"),
  mediaType: text("media_type").notNull(), // game, movie, series
  contentData: jsonb("content_data"), // structured data from source
  status: text("status").default("pending"), // pending, processing, completed, failed
  fetchedAt: timestamp("fetched_at").defaultNow().notNull(),
  processedAt: timestamp("processed_at")
});

export const contentItemSchema = createInsertSchema(contentItems, {
  title: (schema) => schema.min(2, "Title must be at least 2 characters long")
});

export type ContentItem = typeof contentItems.$inferSelect;
export type ContentItemInsert = z.infer<typeof contentItemSchema>;

// Videos table
export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  contentItemId: integer("content_item_id").references(() => contentItems.id),
  templateId: integer("template_id").references(() => videoTemplates.id),
  videoUrl: text("video_url"),
  thumbnailUrl: text("thumbnail_url"),
  duration: integer("duration"), // in seconds
  status: text("status").default("processing"), // processing, ready, failed
  makeScenarioId: text("make_scenario_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at")
});

export const videoSchema = createInsertSchema(videos, {
  title: (schema) => schema.min(2, "Title must be at least 2 characters long")
});

export type Video = typeof videos.$inferSelect;
export type VideoInsert = z.infer<typeof videoSchema>;

// Social Media Platform table
export const socialPlatforms = pgTable("social_platforms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // youtube, instagram, tiktok, twitter
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  tokenExpiry: timestamp("token_expiry"),
  accountId: text("account_id"),
  accountName: text("account_name"),
  isActive: boolean("is_active").default(true),
  rateLimitReset: timestamp("rate_limit_reset"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const socialPlatformSchema = createInsertSchema(socialPlatforms, {
  name: (schema) => schema.min(2, "Name must be at least 2 characters long")
});

export type SocialPlatform = typeof socialPlatforms.$inferSelect;
export type SocialPlatformInsert = z.infer<typeof socialPlatformSchema>;

// Social Media Posts table
export const socialPosts = pgTable("social_posts", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").references(() => videos.id),
  platformId: integer("platform_id").references(() => socialPlatforms.id),
  postText: text("post_text"),
  hashtags: text("hashtags"),
  postUrl: text("post_url"),
  status: text("status").default("pending"), // pending, posted, failed
  scheduledAt: timestamp("scheduled_at"),
  postedAt: timestamp("posted_at"),
  makeScenarioId: text("make_scenario_id"),
  errorMessage: text("error_message"),
  retryCount: integer("retry_count").default(0)
});

export const socialPostSchema = createInsertSchema(socialPosts);

export type SocialPost = typeof socialPosts.$inferSelect;
export type SocialPostInsert = z.infer<typeof socialPostSchema>;

// Activity logs table
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  action: text("action").notNull(), // fetch_content, generate_video, post_social
  status: text("status").notNull(), // success, warning, error
  message: text("message").notNull(),
  details: jsonb("details"),
  entityType: text("entity_type"), // content, video, post
  entityId: integer("entity_id"),
  timestamp: timestamp("timestamp").defaultNow().notNull()
});

export const activityLogSchema = createInsertSchema(activityLogs, {
  message: (schema) => schema.min(2, "Message must be at least 2 characters long")
});

export type ActivityLog = typeof activityLogs.$inferSelect;
export type ActivityLogInsert = z.infer<typeof activityLogSchema>;

// Make.com integration data
export const makeIntegration = pgTable("make_integration", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  scenarioId: varchar("scenario_id", { length: 255 }).notNull(),
  webhookUrl: text("webhook_url"),
  type: varchar("type", { length: 50 }).notNull(), // content_ingestion, video_generation, social_posting, error_monitoring
  lastExecuted: timestamp("last_executed"),
  status: varchar("status", { length: 50 }).default("active"), // active, error, disabled
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
});

export const makeIntegrationSchema = createInsertSchema(makeIntegration, {
  name: (schema) => schema.min(2, "Name must be at least 2 characters long"),
  scenarioId: (schema) => schema.min(5, "Scenario ID must be valid")
});

export type MakeIntegration = typeof makeIntegration.$inferSelect;
export type MakeIntegrationInsert = z.infer<typeof makeIntegrationSchema>;

// System alerts
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // error, warning, info
  source: text("source"), // component that generated the alert
  isResolved: boolean("is_resolved").default(false),
  notificationSent: boolean("notification_sent").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at")
});

export const alertSchema = createInsertSchema(alerts, {
  title: (schema) => schema.min(2, "Title must be at least 2 characters long"),
  message: (schema) => schema.min(2, "Message must be at least 2 characters long")
});

export type Alert = typeof alerts.$inferSelect;
export type AlertInsert = z.infer<typeof alertSchema>;

// Define relations
export const contentSourcesRelations = relations(contentSources, ({ many }) => ({
  contentItems: many(contentItems)
}));

export const contentItemsRelations = relations(contentItems, ({ one, many }) => ({
  source: one(contentSources, { fields: [contentItems.sourceId], references: [contentSources.id] }),
  videos: many(videos)
}));

export const videoTemplatesRelations = relations(videoTemplates, ({ many }) => ({
  videos: many(videos)
}));

export const videosRelations = relations(videos, ({ one, many }) => ({
  contentItem: one(contentItems, { fields: [videos.contentItemId], references: [contentItems.id] }),
  template: one(videoTemplates, { fields: [videos.templateId], references: [videoTemplates.id] }),
  socialPosts: many(socialPosts)
}));

export const socialPlatformsRelations = relations(socialPlatforms, ({ many }) => ({
  posts: many(socialPosts)
}));

export const socialPostsRelations = relations(socialPosts, ({ one }) => ({
  video: one(videos, { fields: [socialPosts.videoId], references: [videos.id] }),
  platform: one(socialPlatforms, { fields: [socialPosts.platformId], references: [socialPlatforms.id] })
}));

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
