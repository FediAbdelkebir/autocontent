import { db } from "@db";
import { eq, desc, and, gte, lte, sql, like, or } from "drizzle-orm";
import { 
  contentSources, ContentSource, ContentSourceInsert,
  videoTemplates, VideoTemplate, VideoTemplateInsert,
  contentItems, ContentItem, ContentItemInsert,
  videos, Video, VideoInsert,
  socialPlatforms, SocialPlatform, SocialPlatformInsert,
  socialPosts, SocialPost, SocialPostInsert,
  activityLogs, ActivityLog, ActivityLogInsert,
  makeIntegration, MakeIntegration, MakeIntegrationInsert,
  alerts, Alert, AlertInsert
} from "@shared/schema";

// Content Sources
export async function getContentSources(): Promise<ContentSource[]> {
  return db.query.contentSources.findMany({
    orderBy: [desc(contentSources.createdAt)]
  });
}

export async function getContentSourceById(id: number): Promise<ContentSource | undefined> {
  return db.query.contentSources.findFirst({
    where: eq(contentSources.id, id)
  });
}

export async function createContentSource(data: ContentSourceInsert): Promise<ContentSource> {
  const [result] = await db.insert(contentSources).values(data).returning();
  return result;
}

export async function updateContentSource(id: number, data: Partial<ContentSourceInsert>): Promise<ContentSource | undefined> {
  const [result] = await db.update(contentSources)
    .set({
      ...data,
      // Don't override the API key if it's not provided (it could be masked in the frontend)
      apiKey: data.apiKey || undefined
    })
    .where(eq(contentSources.id, id))
    .returning();
  return result;
}

export async function deleteContentSource(id: number): Promise<boolean> {
  const [result] = await db.delete(contentSources)
    .where(eq(contentSources.id, id))
    .returning({ id: contentSources.id });
  return !!result;
}

// Video Templates
export async function getVideoTemplates(): Promise<VideoTemplate[]> {
  return db.query.videoTemplates.findMany({
    orderBy: [desc(videoTemplates.createdAt)]
  });
}

export async function getVideoTemplateById(id: number): Promise<VideoTemplate | undefined> {
  return db.query.videoTemplates.findFirst({
    where: eq(videoTemplates.id, id)
  });
}

export async function createVideoTemplate(data: VideoTemplateInsert): Promise<VideoTemplate> {
  const [result] = await db.insert(videoTemplates).values(data).returning();
  return result;
}

export async function updateVideoTemplate(id: number, data: Partial<VideoTemplateInsert>): Promise<VideoTemplate | undefined> {
  const [result] = await db.update(videoTemplates)
    .set(data)
    .where(eq(videoTemplates.id, id))
    .returning();
  return result;
}

export async function deleteVideoTemplate(id: number): Promise<boolean> {
  const [result] = await db.delete(videoTemplates)
    .where(eq(videoTemplates.id, id))
    .returning({ id: videoTemplates.id });
  return !!result;
}

// Content Items
export async function getContentItems(limit = 10, offset = 0, status?: string): Promise<ContentItem[]> {
  let query = db.select().from(contentItems).orderBy(desc(contentItems.fetchedAt));
  
  if (status) {
    query = query.where(eq(contentItems.status, status));
  }
  
  return query.limit(limit).offset(offset);
}

export async function getContentItemById(id: number): Promise<ContentItem | undefined> {
  return db.query.contentItems.findFirst({
    where: eq(contentItems.id, id)
  });
}

export async function createContentItem(data: ContentItemInsert): Promise<ContentItem> {
  const [result] = await db.insert(contentItems).values(data).returning();
  return result;
}

export async function updateContentItem(id: number, data: Partial<ContentItemInsert>): Promise<ContentItem | undefined> {
  const [result] = await db.update(contentItems)
    .set(data)
    .where(eq(contentItems.id, id))
    .returning();
  return result;
}

// Videos
export async function getVideos(limit = 10, offset = 0, status?: string): Promise<Video[]> {
  let query = db.select().from(videos).orderBy(desc(videos.createdAt));
  
  if (status) {
    query = query.where(eq(videos.status, status));
  }
  
  return query.limit(limit).offset(offset);
}

export async function getVideoById(id: number): Promise<Video | undefined> {
  return db.query.videos.findFirst({
    where: eq(videos.id, id)
  });
}

export async function createVideo(data: VideoInsert): Promise<Video> {
  const [result] = await db.insert(videos).values(data).returning();
  return result;
}

export async function updateVideo(id: number, data: Partial<VideoInsert>): Promise<Video | undefined> {
  const [result] = await db.update(videos)
    .set(data)
    .where(eq(videos.id, id))
    .returning();
  return result;
}

// Social Platforms
export async function getSocialPlatforms(): Promise<SocialPlatform[]> {
  return db.query.socialPlatforms.findMany({
    orderBy: [desc(socialPlatforms.createdAt)]
  });
}

export async function getSocialPlatformById(id: number): Promise<SocialPlatform | undefined> {
  return db.query.socialPlatforms.findFirst({
    where: eq(socialPlatforms.id, id)
  });
}

export async function createSocialPlatform(data: SocialPlatformInsert): Promise<SocialPlatform> {
  const [result] = await db.insert(socialPlatforms).values(data).returning();
  return result;
}

export async function updateSocialPlatform(id: number, data: Partial<SocialPlatformInsert>): Promise<SocialPlatform | undefined> {
  const [result] = await db.update(socialPlatforms)
    .set({
      ...data,
      // Don't override tokens if they're not provided
      accessToken: data.accessToken || undefined,
      refreshToken: data.refreshToken || undefined
    })
    .where(eq(socialPlatforms.id, id))
    .returning();
  return result;
}

export async function deleteSocialPlatform(id: number): Promise<boolean> {
  const [result] = await db.delete(socialPlatforms)
    .where(eq(socialPlatforms.id, id))
    .returning({ id: socialPlatforms.id });
  return !!result;
}

// Social Posts
export async function getSocialPosts(limit = 10, offset = 0, status?: string): Promise<SocialPost[]> {
  let query = db.select().from(socialPosts).orderBy(desc(socialPosts.scheduledAt || socialPosts.postedAt));
  
  if (status) {
    query = query.where(eq(socialPosts.status, status));
  }
  
  return query.limit(limit).offset(offset);
}

export async function getSocialPostById(id: number): Promise<SocialPost | undefined> {
  return db.query.socialPosts.findFirst({
    where: eq(socialPosts.id, id)
  });
}

export async function createSocialPost(data: SocialPostInsert): Promise<SocialPost> {
  const [result] = await db.insert(socialPosts).values(data).returning();
  return result;
}

export async function updateSocialPost(id: number, data: Partial<SocialPostInsert>): Promise<SocialPost | undefined> {
  const [result] = await db.update(socialPosts)
    .set(data)
    .where(eq(socialPosts.id, id))
    .returning();
  return result;
}

// Activity Logs
export async function getActivityLogs(limit = 20, offset = 0, status?: string): Promise<ActivityLog[]> {
  let query = db.select().from(activityLogs).orderBy(desc(activityLogs.timestamp));
  
  if (status) {
    query = query.where(eq(activityLogs.status, status));
  }
  
  return query.limit(limit).offset(offset);
}

export async function createActivityLog(data: ActivityLogInsert): Promise<ActivityLog> {
  const [result] = await db.insert(activityLogs).values(data).returning();
  return result;
}

// Make.com Integration
export async function getMakeIntegrations(): Promise<MakeIntegration[]> {
  return db.query.makeIntegration.findMany({
    orderBy: [desc(makeIntegration.lastExecuted)]
  });
}

export async function getMakeIntegrationById(id: number): Promise<MakeIntegration | undefined> {
  return db.query.makeIntegration.findFirst({
    where: eq(makeIntegration.id, id)
  });
}

export async function createMakeIntegration(data: MakeIntegrationInsert): Promise<MakeIntegration> {
  const [result] = await db.insert(makeIntegration).values(data).returning();
  return result;
}

export async function updateMakeIntegration(id: number, data: Partial<MakeIntegrationInsert>): Promise<MakeIntegration | undefined> {
  const [result] = await db.update(makeIntegration)
    .set({
      ...data,
      updatedAt: new Date()
    })
    .where(eq(makeIntegration.id, id))
    .returning();
  return result;
}

// Alerts
export async function getAlerts(limit = 10, resolved = false): Promise<Alert[]> {
  return db.select().from(alerts)
    .where(eq(alerts.isResolved, resolved))
    .orderBy(desc(alerts.createdAt))
    .limit(limit);
}

export async function getAlertById(id: number): Promise<Alert | undefined> {
  return db.query.alerts.findFirst({
    where: eq(alerts.id, id)
  });
}

export async function createAlert(data: AlertInsert): Promise<Alert> {
  const [result] = await db.insert(alerts).values(data).returning();
  return result;
}

export async function resolveAlert(id: number): Promise<Alert | undefined> {
  const [result] = await db.update(alerts)
    .set({
      isResolved: true,
      resolvedAt: new Date()
    })
    .where(eq(alerts.id, id))
    .returning();
  return result;
}

// Dashboard Statistics
export async function getDashboardStats() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  
  // Videos created today
  const videosCreatedToday = await db.select({ count: sql<number>`count(*)` })
    .from(videos)
    .where(gte(videos.createdAt, date));
  
  // Posts published across platforms
  const postsPublished = await db.select({ count: sql<number>`count(*)` })
    .from(socialPosts)
    .where(eq(socialPosts.status, 'posted'));
  
  // Active content sources
  const activeContentSources = await db.select({ count: sql<number>`count(*)` })
    .from(contentSources)
    .where(eq(contentSources.isActive, true));
  
  // System alerts count
  const systemAlerts = await db.select({ count: sql<number>`count(*)` })
    .from(alerts)
    .where(eq(alerts.isResolved, false));
  
  return {
    videosCreatedToday: videosCreatedToday[0]?.count || 0,
    postsPublished: postsPublished[0]?.count || 0,
    activeContentSources: activeContentSources[0]?.count || 0,
    systemAlerts: systemAlerts[0]?.count || 0
  };
}

// Recent content with platform info
export async function getRecentContent(limit = 10) {
  const recentVideos = await db.query.videos.findMany({
    orderBy: [desc(videos.createdAt)],
    limit,
    with: {
      contentItem: true,
      template: true,
      socialPosts: {
        with: {
          platform: true
        }
      }
    }
  });
  
  return recentVideos;
}
