import { db } from "./index";
import * as schema from "@shared/schema";

async function seed() {
  try {
    console.log("Seeding database...");

    // Seed Content Sources
    const contentSources = [
      {
        name: "IGN",
        type: "RSS",
        url: "https://feeds.ign.com/ign/all",
        isActive: true,
        fetchInterval: 30
      },
      {
        name: "GameSpot",
        type: "RSS",
        url: "https://www.gamespot.com/feeds/game-news",
        isActive: false,
        fetchInterval: 30
      },
      {
        name: "RAWG API",
        type: "API",
        url: "https://api.rawg.io/api/games",
        apiKey: "RAWG_API_KEY_ENV_VAR",
        isActive: true,
        fetchInterval: 60
      },
      {
        name: "TMDB API",
        type: "API",
        url: "https://api.themoviedb.org/3",
        apiKey: "TMDB_API_KEY_ENV_VAR",
        isActive: true,
        fetchInterval: 60
      },
      {
        name: "Reddit r/gaming",
        type: "API",
        url: "https://www.reddit.com/r/gaming/top.json",
        isActive: true,
        fetchInterval: 30
      },
      {
        name: "Rotten Tomatoes",
        type: "RSS",
        url: "https://editorial.rottentomatoes.com/feed/",
        isActive: true,
        fetchInterval: 45
      },
      {
        name: "Steam News",
        type: "API",
        url: "https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/",
        isActive: true,
        fetchInterval: 60
      },
      {
        name: "Epic Games Store",
        type: "API",
        url: "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions",
        isActive: true,
        fetchInterval: 60
      }
    ];

    for (const source of contentSources) {
      // Check if the source already exists
      const existingSource = await db.query.contentSources.findFirst({
        where: { name: source.name } as any
      });

      if (!existingSource) {
        await db.insert(schema.contentSources).values(source);
        console.log(`Created content source: ${source.name}`);
      }
    }

    // Seed Video Templates
    const videoTemplates = [
      {
        name: "Countdown Format",
        description: "Top 5/10 lists with animated transitions",
        type: "countdown",
        makeConfig: { templateId: "countdown-template", duration: 60 },
        duration: 60,
        aspectRatio: "9:16"
      },
      {
        name: "Trailer Analysis",
        description: "Trailer breakdown with key moment highlights",
        type: "trailer",
        makeConfig: { templateId: "trailer-analysis-template", duration: 90 },
        duration: 90,
        aspectRatio: "9:16"
      },
      {
        name: "News Update",
        description: "Breaking news with animated text overlays",
        type: "news",
        makeConfig: { templateId: "news-template", duration: 45 },
        duration: 45,
        aspectRatio: "9:16"
      },
      {
        name: "Gameplay Highlights",
        description: "Short gameplay clips with commentary",
        type: "gameplay",
        makeConfig: { templateId: "gameplay-template", duration: 60 },
        duration: 60,
        aspectRatio: "9:16"
      }
    ];

    for (const template of videoTemplates) {
      // Check if the template already exists
      const existingTemplate = await db.query.videoTemplates.findFirst({
        where: { name: template.name } as any
      });

      if (!existingTemplate) {
        await db.insert(schema.videoTemplates).values(template);
        console.log(`Created video template: ${template.name}`);
      }
    }

    // Seed Social Platforms
    const socialPlatforms = [
      {
        name: "YouTube",
        type: "youtube",
        accountName: "GameEntertainmentChannel",
        isActive: true
      },
      {
        name: "Instagram",
        type: "instagram",
        accountName: "game.entertainment",
        isActive: true
      },
      {
        name: "TikTok",
        type: "tiktok",
        accountName: "@gameentertainment",
        isActive: true,
        rateLimitReset: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now
      },
      {
        name: "X (Twitter)",
        type: "twitter",
        accountName: "@GameEntertainment",
        isActive: true
      }
    ];

    for (const platform of socialPlatforms) {
      // Check if the platform already exists
      const existingPlatform = await db.query.socialPlatforms.findFirst({
        where: { name: platform.name } as any
      });

      if (!existingPlatform) {
        await db.insert(schema.socialPlatforms).values(platform);
        console.log(`Created social platform: ${platform.name}`);
      }
    }

    // Seed Make.com integrations
    const makeIntegrations = [
      {
        name: "Content Ingestion Workflow",
        scenarioId: "content-ingestion-123",
        webhookUrl: "https://hook.make.com/content-ingestion-webhook",
        type: "content_ingestion",
        status: "active",
        lastExecuted: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
      },
      {
        name: "Video Generation Workflow",
        scenarioId: "video-generation-456",
        webhookUrl: "https://hook.make.com/video-generation-webhook",
        type: "video_generation",
        status: "active",
        lastExecuted: new Date(Date.now() - 32 * 60 * 1000) // 32 minutes ago
      },
      {
        name: "Social Media Posting Workflow",
        scenarioId: "social-posting-789",
        webhookUrl: "https://hook.make.com/social-posting-webhook",
        type: "social_posting",
        status: "error",
        lastExecuted: new Date(Date.now() - 12 * 60 * 1000) // 12 minutes ago
      },
      {
        name: "Error Monitoring Workflow",
        scenarioId: "error-monitoring-012",
        webhookUrl: "https://hook.make.com/error-monitoring-webhook",
        type: "error_monitoring",
        status: "active",
        lastExecuted: new Date(Date.now() - 2 * 60 * 1000) // 2 minutes ago
      }
    ];

    for (const integration of makeIntegrations) {
      // Check if the integration already exists
      const existingIntegration = await db.query.makeIntegration.findFirst({
        where: { name: integration.name } as any
      });

      if (!existingIntegration) {
        await db.insert(schema.makeIntegration).values(integration);
        console.log(`Created Make.com integration: ${integration.name}`);
      }
    }

    // Seed content items
    const contentItems = [
      {
        title: "Top 5 Game Releases - June 2023",
        description: "The hottest games releasing this month",
        sourceId: 1, // IGN
        mediaType: "game",
        status: "completed",
        fetchedAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        processedAt: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
      },
      {
        title: "Starfield - Official Trailer Breakdown",
        description: "Analyzing the latest trailer for Bethesda's Starfield",
        sourceId: 3, // RAWG API
        originalUrl: "https://www.youtube.com/watch?v=Hs-BXFgXT_4",
        thumbnailUrl: "https://images.unsplash.com/photo-1596385246695-dd0be392e585",
        mediaType: "game",
        status: "processing",
        fetchedAt: new Date(Date.now() - 70 * 60 * 1000) // 70 minutes ago
      },
      {
        title: "The Last of Us - Season 2 Casting News",
        description: "Latest casting news for the HBO series",
        sourceId: 4, // TMDB API
        thumbnailUrl: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd",
        mediaType: "series",
        status: "completed",
        fetchedAt: new Date(Date.now() - 120 * 60 * 1000), // 2 hours ago
        processedAt: new Date(Date.now() - 90 * 60 * 1000) // 1.5 hours ago
      },
      {
        title: "Top 10 Easter Eggs in Hogwarts Legacy",
        description: "Hidden secrets you might have missed",
        sourceId: 5, // Reddit r/gaming
        thumbnailUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f",
        mediaType: "game",
        status: "failed",
        fetchedAt: new Date(Date.now() - 200 * 60 * 1000), // 3.3 hours ago
        processedAt: new Date(Date.now() - 180 * 60 * 1000) // 3 hours ago
      }
    ];

    // First clear existing items if needed
    // await db.delete(schema.contentItems);

    for (const item of contentItems) {
      // Check if the item already exists
      const existingItem = await db.query.contentItems.findFirst({
        where: { title: item.title } as any
      });

      if (!existingItem) {
        await db.insert(schema.contentItems).values(item);
        console.log(`Created content item: ${item.title}`);
      }
    }

    // Seed videos
    // First get content item IDs
    const contentItemsFromDb = await db.query.contentItems.findMany();
    const contentItemMap = new Map(
      contentItemsFromDb.map(item => [item.title, item.id])
    );

    // Get template IDs
    const templatesFromDb = await db.query.videoTemplates.findMany();
    const templateMap = new Map(
      templatesFromDb.map(template => [template.name, template.id])
    );

    if (contentItemMap.size > 0 && templateMap.size > 0) {
      const videos = [
        {
          title: "Top 5 Game Releases - June 2023",
          description: "The hottest games releasing this month",
          contentItemId: contentItemMap.get("Top 5 Game Releases - June 2023"),
          templateId: templateMap.get("Countdown Format"),
          thumbnailUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420",
          duration: 60,
          status: "ready",
          createdAt: new Date(Date.now() - 40 * 60 * 1000), // 40 minutes ago
          completedAt: new Date(Date.now() - 28 * 60 * 1000) // 28 minutes ago
        },
        {
          title: "Starfield - Official Trailer Breakdown",
          description: "Analyzing the latest trailer for Bethesda's Starfield",
          contentItemId: contentItemMap.get("Starfield - Official Trailer Breakdown"),
          templateId: templateMap.get("Trailer Analysis"),
          thumbnailUrl: "https://images.unsplash.com/photo-1596385246695-dd0be392e585",
          duration: 90,
          status: "processing",
          createdAt: new Date(Date.now() - 62 * 60 * 1000) // 62 minutes ago
        },
        {
          title: "The Last of Us - Season 2 Casting News",
          description: "Latest casting news for the HBO series",
          contentItemId: contentItemMap.get("The Last of Us - Season 2 Casting News"),
          templateId: templateMap.get("News Update"),
          thumbnailUrl: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd",
          duration: 45,
          status: "ready",
          createdAt: new Date(Date.now() - 110 * 60 * 1000), // 1.8 hours ago
          completedAt: new Date(Date.now() - 100 * 60 * 1000) // 1.6 hours ago
        },
        {
          title: "Top 10 Easter Eggs in Hogwarts Legacy",
          description: "Hidden secrets you might have missed",
          contentItemId: contentItemMap.get("Top 10 Easter Eggs in Hogwarts Legacy"),
          templateId: templateMap.get("Countdown Format"),
          thumbnailUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f",
          duration: 60,
          status: "failed",
          createdAt: new Date(Date.now() - 190 * 60 * 1000) // 3.1 hours ago
        }
      ];

      for (const video of videos) {
        if (video.contentItemId && video.templateId) {
          // Check if the video already exists
          const existingVideo = await db.query.videos.findFirst({
            where: { title: video.title } as any
          });

          if (!existingVideo) {
            await db.insert(schema.videos).values(video);
            console.log(`Created video: ${video.title}`);
          }
        }
      }
    }

    // Seed social posts
    // First get video IDs and platform IDs
    const videosFromDb = await db.query.videos.findMany();
    const videoMap = new Map(
      videosFromDb.map(video => [video.title, video.id])
    );

    const platformsFromDb = await db.query.socialPlatforms.findMany();
    const platformMap = new Map(
      platformsFromDb.map(platform => [platform.name, platform.id])
    );

    if (videoMap.size > 0 && platformMap.size > 0) {
      const socialPosts = [
        {
          videoId: videoMap.get("Top 5 Game Releases - June 2023"),
          platformId: platformMap.get("YouTube"),
          postText: "Check out our countdown of the top 5 games releasing this month! #gaming #newreleases",
          status: "posted",
          postedAt: new Date(Date.now() - 28 * 60 * 1000) // 28 minutes ago
        },
        {
          videoId: videoMap.get("Top 5 Game Releases - June 2023"),
          platformId: platformMap.get("Instagram"),
          postText: "🎮 Top 5 games you NEED to play this month! 🔥 #gaming #topgames",
          status: "posted",
          postedAt: new Date(Date.now() - 28 * 60 * 1000) // 28 minutes ago
        },
        {
          videoId: videoMap.get("Starfield - Official Trailer Breakdown"),
          platformId: platformMap.get("YouTube"),
          postText: "Analyzing the latest Starfield trailer - what did we miss? #Starfield #Bethesda",
          status: "pending",
          scheduledAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now
        },
        {
          videoId: videoMap.get("Starfield - Official Trailer Breakdown"),
          platformId: platformMap.get("Instagram"),
          postText: "Breaking down the Starfield trailer 🚀 #Starfield #SpaceGame",
          status: "pending",
          scheduledAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now
        },
        {
          videoId: videoMap.get("Starfield - Official Trailer Breakdown"),
          platformId: platformMap.get("TikTok"),
          postText: "Starfield hidden details you missed! #gaming #starfield #bethesda",
          status: "failed",
          errorMessage: "API rate limit exceeded",
          retryCount: 1,
          scheduledAt: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
        },
        {
          videoId: videoMap.get("Starfield - Official Trailer Breakdown"),
          platformId: platformMap.get("X (Twitter)"),
          postText: "We analyzed Starfield's new trailer frame by frame. Here's what we found: #Starfield #Bethesda #GameAnalysis",
          status: "pending",
          scheduledAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now
        },
        {
          videoId: videoMap.get("The Last of Us - Season 2 Casting News"),
          platformId: platformMap.get("YouTube"),
          postText: "The Last of Us Season 2 - All new cast members revealed! #TheLastOfUs #HBO",
          status: "posted",
          postedAt: new Date(Date.now() - 95 * 60 * 1000) // 1.6 hours ago
        },
        {
          videoId: videoMap.get("The Last of Us - Season 2 Casting News"),
          platformId: platformMap.get("X (Twitter)"),
          postText: "BREAKING: New cast members join #TheLastOfUs Season 2! Our analysis of what this means for the story:",
          status: "posted",
          postedAt: new Date(Date.now() - 95 * 60 * 1000) // 1.6 hours ago
        },
        {
          videoId: videoMap.get("Top 10 Easter Eggs in Hogwarts Legacy"),
          platformId: platformMap.get("YouTube"),
          postText: "Did you find all these hidden secrets in Hogwarts Legacy? #HogwartsLegacy #HarryPotter #EasterEggs",
          status: "failed",
          errorMessage: "Video processing failed: Invalid format",
          retryCount: 3
        },
        {
          videoId: videoMap.get("Top 10 Easter Eggs in Hogwarts Legacy"),
          platformId: platformMap.get("Instagram"),
          postText: "10 mind-blowing secrets in Hogwarts Legacy! 🧙‍♂️ #HogwartsLegacy #HarryPotter",
          status: "failed",
          errorMessage: "Video processing failed: Invalid format",
          retryCount: 3
        },
        {
          videoId: videoMap.get("Top 10 Easter Eggs in Hogwarts Legacy"),
          platformId: platformMap.get("TikTok"),
          postText: "Hidden Harry Potter references in Hogwarts Legacy! #hogwartslegacy #harrypotter #eastereggs",
          status: "failed",
          errorMessage: "Video processing failed: Invalid format",
          retryCount: 3
        }
      ];

      for (const post of socialPosts) {
        if (post.videoId && post.platformId) {
          // Check if the post already exists
          const existingPost = await db.query.socialPosts.findFirst({
            where: {
              videoId: post.videoId,
              platformId: post.platformId
            } as any
          });

          if (!existingPost) {
            await db.insert(schema.socialPosts).values(post);
            console.log(`Created social post for platform ID ${post.platformId}`);
          }
        }
      }
    }

    // Seed alerts
    const alerts = [
      {
        title: "TikTok API Rate Limit",
        message: "System encountered a rate limit while posting to TikTok. Scheduled retry in 15 minutes.",
        type: "error",
        source: "tiktok_api",
        isResolved: false,
        createdAt: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
      },
      {
        title: "Content Source Offline",
        message: "GameSpot RSS feed is currently unavailable. System will retry connection in 30 minutes.",
        type: "warning",
        source: "content_ingestion",
        isResolved: false,
        createdAt: new Date(Date.now() - 68 * 60 * 1000) // 68 minutes ago
      }
    ];

    for (const alert of alerts) {
      // Check if the alert already exists
      const existingAlert = await db.query.alerts.findFirst({
        where: { title: alert.title } as any
      });

      if (!existingAlert) {
        await db.insert(schema.alerts).values(alert);
        console.log(`Created alert: ${alert.title}`);
      }
    }

    // Seed activity logs
    const activityLogs = [
      {
        action: "tiktok_api_error",
        status: "error",
        message: "TikTok API Rate Limit",
        details: { error: "Rate limit exceeded", retryAfter: "15 minutes" },
        entityType: "social_platform",
        entityId: platformMap.get("TikTok"),
        timestamp: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
      },
      {
        action: "post_video",
        status: "success",
        message: "Video Posted Successfully",
        details: { platforms: ["YouTube", "Instagram"] },
        entityType: "video",
        entityId: videoMap.get("Top 5 Game Releases - June 2023"),
        timestamp: new Date(Date.now() - 28 * 60 * 1000) // 28 minutes ago
      },
      {
        action: "generate_video",
        status: "success",
        message: "Video Generated",
        details: { template: "Countdown Format" },
        entityType: "video",
        entityId: videoMap.get("Top 5 Game Releases - June 2023"),
        timestamp: new Date(Date.now() - 32 * 60 * 1000) // 32 minutes ago
      },
      {
        action: "content_source_error",
        status: "warning",
        message: "Content Source Offline",
        details: { source: "GameSpot RSS feed", retryAfter: "30 minutes" },
        entityType: "content_source",
        entityId: 2, // GameSpot
        timestamp: new Date(Date.now() - 68 * 60 * 1000) // 68 minutes ago
      },
      {
        action: "new_content",
        status: "success",
        message: "New Content Detected",
        details: { title: "Starfield", source: "IGN" },
        entityType: "content_item",
        entityId: contentItemMap.get("Starfield - Official Trailer Breakdown"),
        timestamp: new Date(Date.now() - 90 * 60 * 1000) // 90 minutes ago
      }
    ];

    for (const log of activityLogs) {
      // Activity logs can be duplicated, so we'll just insert them
      await db.insert(schema.activityLogs).values(log);
      console.log(`Created activity log: ${log.message}`);
    }

    console.log("Database seeding completed!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
