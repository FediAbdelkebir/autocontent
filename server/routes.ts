import type { Express } from "express";
import { createServer, type Server } from "http";
import * as storage from "./storage";
import { sendAlertToSlack } from "./slack";
import { z } from "zod";
import { 
  contentSourceSchema,
  videoTemplateSchema,
  contentItemSchema,
  videoSchema,
  socialPlatformSchema,
  socialPostSchema,
  activityLogSchema,
  makeIntegrationSchema,
  alertSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const apiPrefix = '/api';

  // Dashboard statistics
  app.get(`${apiPrefix}/dashboard/stats`, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      return res.status(200).json(stats);
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      return res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
    }
  });

  // Get recent content for dashboard
  app.get(`${apiPrefix}/dashboard/recent-content`, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const recentContent = await storage.getRecentContent(limit);
      return res.status(200).json(recentContent);
    } catch (error) {
      console.error('Error getting recent content:', error);
      return res.status(500).json({ error: 'Failed to fetch recent content' });
    }
  });

  // Content Sources
  app.get(`${apiPrefix}/content-sources`, async (req, res) => {
    try {
      const sources = await storage.getContentSources();
      return res.status(200).json(sources);
    } catch (error) {
      console.error('Error getting content sources:', error);
      return res.status(500).json({ error: 'Failed to fetch content sources' });
    }
  });

  app.get(`${apiPrefix}/content-sources/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const source = await storage.getContentSourceById(id);
      
      if (!source) {
        return res.status(404).json({ error: 'Content source not found' });
      }
      
      return res.status(200).json(source);
    } catch (error) {
      console.error('Error getting content source:', error);
      return res.status(500).json({ error: 'Failed to fetch content source' });
    }
  });

  app.post(`${apiPrefix}/content-sources`, async (req, res) => {
    try {
      const validatedData = contentSourceSchema.parse(req.body);
      const newSource = await storage.createContentSource(validatedData);
      
      await storage.createActivityLog({
        action: 'create_content_source',
        status: 'success',
        message: `Created content source: ${newSource.name}`,
        entityType: 'content_source',
        entityId: newSource.id
      });
      
      return res.status(201).json(newSource);
    } catch (error) {
      console.error('Error creating content source:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      
      return res.status(500).json({ error: 'Failed to create content source' });
    }
  });

  app.put(`${apiPrefix}/content-sources/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = contentSourceSchema.partial().parse(req.body);
      const updatedSource = await storage.updateContentSource(id, validatedData);
      
      if (!updatedSource) {
        return res.status(404).json({ error: 'Content source not found' });
      }
      
      await storage.createActivityLog({
        action: 'update_content_source',
        status: 'success',
        message: `Updated content source: ${updatedSource.name}`,
        entityType: 'content_source',
        entityId: updatedSource.id
      });
      
      return res.status(200).json(updatedSource);
    } catch (error) {
      console.error('Error updating content source:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      
      return res.status(500).json({ error: 'Failed to update content source' });
    }
  });

  app.delete(`${apiPrefix}/content-sources/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteContentSource(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Content source not found' });
      }
      
      await storage.createActivityLog({
        action: 'delete_content_source',
        status: 'success',
        message: `Deleted content source with ID: ${id}`,
        entityType: 'content_source',
        entityId: id
      });
      
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting content source:', error);
      return res.status(500).json({ error: 'Failed to delete content source' });
    }
  });

  // Video Templates
  app.get(`${apiPrefix}/video-templates`, async (req, res) => {
    try {
      const templates = await storage.getVideoTemplates();
      return res.status(200).json(templates);
    } catch (error) {
      console.error('Error getting video templates:', error);
      return res.status(500).json({ error: 'Failed to fetch video templates' });
    }
  });

  app.get(`${apiPrefix}/video-templates/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const template = await storage.getVideoTemplateById(id);
      
      if (!template) {
        return res.status(404).json({ error: 'Video template not found' });
      }
      
      return res.status(200).json(template);
    } catch (error) {
      console.error('Error getting video template:', error);
      return res.status(500).json({ error: 'Failed to fetch video template' });
    }
  });

  app.post(`${apiPrefix}/video-templates`, async (req, res) => {
    try {
      const validatedData = videoTemplateSchema.parse(req.body);
      const newTemplate = await storage.createVideoTemplate(validatedData);
      
      await storage.createActivityLog({
        action: 'create_video_template',
        status: 'success',
        message: `Created video template: ${newTemplate.name}`,
        entityType: 'video_template',
        entityId: newTemplate.id
      });
      
      return res.status(201).json(newTemplate);
    } catch (error) {
      console.error('Error creating video template:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      
      return res.status(500).json({ error: 'Failed to create video template' });
    }
  });

  app.put(`${apiPrefix}/video-templates/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = videoTemplateSchema.partial().parse(req.body);
      const updatedTemplate = await storage.updateVideoTemplate(id, validatedData);
      
      if (!updatedTemplate) {
        return res.status(404).json({ error: 'Video template not found' });
      }
      
      await storage.createActivityLog({
        action: 'update_video_template',
        status: 'success',
        message: `Updated video template: ${updatedTemplate.name}`,
        entityType: 'video_template',
        entityId: updatedTemplate.id
      });
      
      return res.status(200).json(updatedTemplate);
    } catch (error) {
      console.error('Error updating video template:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      
      return res.status(500).json({ error: 'Failed to update video template' });
    }
  });

  app.delete(`${apiPrefix}/video-templates/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteVideoTemplate(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Video template not found' });
      }
      
      await storage.createActivityLog({
        action: 'delete_video_template',
        status: 'success',
        message: `Deleted video template with ID: ${id}`,
        entityType: 'video_template',
        entityId: id
      });
      
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting video template:', error);
      return res.status(500).json({ error: 'Failed to delete video template' });
    }
  });

  // Activity Logs
  app.get(`${apiPrefix}/activity-logs`, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const status = req.query.status as string | undefined;
      
      const logs = await storage.getActivityLogs(limit, offset, status);
      return res.status(200).json(logs);
    } catch (error) {
      console.error('Error getting activity logs:', error);
      return res.status(500).json({ error: 'Failed to fetch activity logs' });
    }
  });

  // Alerts
  app.get(`${apiPrefix}/alerts`, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const resolved = req.query.resolved === 'true';
      
      const alertsList = await storage.getAlerts(limit, resolved);
      return res.status(200).json(alertsList);
    } catch (error) {
      console.error('Error getting alerts:', error);
      return res.status(500).json({ error: 'Failed to fetch alerts' });
    }
  });

  app.post(`${apiPrefix}/alerts`, async (req, res) => {
    try {
      const validatedData = alertSchema.parse(req.body);
      const newAlert = await storage.createAlert(validatedData);
      
      await storage.createActivityLog({
        action: 'create_alert',
        status: 'success',
        message: `Created alert: ${newAlert.title}`,
        entityType: 'alert',
        entityId: newAlert.id
      });
      
      // Send alert to Slack
      try {
        await sendAlertToSlack(
          newAlert.title,
          newAlert.message,
          newAlert.type as "error" | "warning" | "info" | "success",
          { source: newAlert.source }
        );
      } catch (slackError) {
        console.error('Failed to send alert to Slack:', slackError);
        // Don't fail the request if Slack notification fails
      }
      
      return res.status(201).json(newAlert);
    } catch (error) {
      console.error('Error creating alert:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      
      return res.status(500).json({ error: 'Failed to create alert' });
    }
  });

  app.put(`${apiPrefix}/alerts/:id/resolve`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const resolvedAlert = await storage.resolveAlert(id);
      
      if (!resolvedAlert) {
        return res.status(404).json({ error: 'Alert not found' });
      }
      
      await storage.createActivityLog({
        action: 'resolve_alert',
        status: 'success',
        message: `Resolved alert: ${resolvedAlert.title}`,
        entityType: 'alert',
        entityId: resolvedAlert.id
      });
      
      return res.status(200).json(resolvedAlert);
    } catch (error) {
      console.error('Error resolving alert:', error);
      return res.status(500).json({ error: 'Failed to resolve alert' });
    }
  });

  // Make.com integrations
  app.get(`${apiPrefix}/make-integrations`, async (req, res) => {
    try {
      const integrations = await storage.getMakeIntegrations();
      return res.status(200).json(integrations);
    } catch (error) {
      console.error('Error getting Make.com integrations:', error);
      return res.status(500).json({ error: 'Failed to fetch Make.com integrations' });
    }
  });

  app.post(`${apiPrefix}/make-integrations`, async (req, res) => {
    try {
      const validatedData = makeIntegrationSchema.parse(req.body);
      const newIntegration = await storage.createMakeIntegration(validatedData);
      
      await storage.createActivityLog({
        action: 'create_make_integration',
        status: 'success',
        message: `Created Make.com integration: ${newIntegration.name}`,
        entityType: 'make_integration',
        entityId: newIntegration.id
      });
      
      return res.status(201).json(newIntegration);
    } catch (error) {
      console.error('Error creating Make.com integration:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      
      return res.status(500).json({ error: 'Failed to create Make.com integration' });
    }
  });

  app.put(`${apiPrefix}/make-integrations/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = makeIntegrationSchema.partial().parse(req.body);
      const updatedIntegration = await storage.updateMakeIntegration(id, validatedData);
      
      if (!updatedIntegration) {
        return res.status(404).json({ error: 'Make.com integration not found' });
      }
      
      await storage.createActivityLog({
        action: 'update_make_integration',
        status: 'success',
        message: `Updated Make.com integration: ${updatedIntegration.name}`,
        entityType: 'make_integration',
        entityId: updatedIntegration.id
      });
      
      return res.status(200).json(updatedIntegration);
    } catch (error) {
      console.error('Error updating Make.com integration:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      
      return res.status(500).json({ error: 'Failed to update Make.com integration' });
    }
  });

  // Process webhook from Make.com scenarios
  app.post(`${apiPrefix}/webhooks/make`, async (req, res) => {
    try {
      const { type, data, status, message } = req.body;
      
      if (!type || !data) {
        return res.status(400).json({ error: 'Invalid webhook payload' });
      }
      
      // Log the webhook activity
      await storage.createActivityLog({
        action: `make_webhook_${type}`,
        status: status || 'success',
        message: message || `Received webhook from Make.com for ${type}`,
        details: data
      });
      
      // Handle different webhook types
      switch (type) {
        case 'content_ingestion':
          // Process ingested content
          if (data.title && data.sourceId) {
            await storage.createContentItem({
              title: data.title,
              description: data.description,
              sourceId: data.sourceId,
              originalUrl: data.originalUrl,
              thumbnailUrl: data.thumbnailUrl,
              mediaType: data.mediaType || 'unknown',
              contentData: data.contentData || {}
            });
          }
          break;
          
        case 'video_generation':
          // Update video status
          if (data.videoId) {
            await storage.updateVideo(data.videoId, {
              status: data.status || 'ready',
              videoUrl: data.videoUrl,
              thumbnailUrl: data.thumbnailUrl,
              completedAt: data.status === 'ready' ? new Date() : undefined
            });
          }
          break;
          
        case 'social_posting':
          // Update social post status
          if (data.postId) {
            await storage.updateSocialPost(data.postId, {
              status: data.status || 'posted',
              postUrl: data.postUrl,
              errorMessage: data.errorMessage,
              postedAt: data.status === 'posted' ? new Date() : undefined
            });
          }
          break;
          
        case 'alert':
          // Create system alert
          const alert = await storage.createAlert({
            title: data.title || 'System Alert',
            message: data.message || 'An issue was detected by Make.com',
            type: data.alertType || 'warning',
            source: 'make.com'
          });
          
          // Send to Slack for immediate notification
          try {
            await sendAlertToSlack(
              alert.title,
              alert.message,
              alert.type as "error" | "warning" | "info" | "success",
              { 
                source: alert.source,
                details: data.details || {},
                timestamp: alert.createdAt.toISOString()
              }
            );
          } catch (slackError) {
            console.error('Failed to send Make.com alert to Slack:', slackError);
          }
          break;
      }
      
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error processing Make.com webhook:', error);
      return res.status(500).json({ error: 'Failed to process webhook' });
    }
  });

  // Test endpoint for Slack alerts (for development use)
  app.post(`${apiPrefix}/test-slack-alert`, async (req, res) => {
    try {
      const { title, message, type, details } = req.body;
      
      if (!title || !message || !type) {
        return res.status(400).json({ 
          error: 'Missing required fields. Please provide title, message, and type.' 
        });
      }
      
      // Send test alert to Slack
      await sendAlertToSlack(
        title,
        message,
        type,
        details || { source: 'test-endpoint' }
      );
      
      // Log the test
      await storage.createActivityLog({
        action: 'test_slack_alert',
        status: 'success',
        message: `Sent test Slack alert: ${title}`,
        details: { title, message, type }
      });
      
      return res.status(200).json({ success: true, message: 'Test alert sent to Slack' });
    } catch (error) {
      console.error('Error sending test Slack alert:', error);
      return res.status(500).json({ error: 'Failed to send test alert to Slack' });
    }
  });
  
  // Content generation endpoint
  app.post(`${apiPrefix}/generate-content`, async (req, res) => {
    try {
      const { sourceId, templateId } = req.body;
      
      if (!sourceId || !templateId) {
        return res.status(400).json({ 
          error: 'Missing required fields. Please provide sourceId and templateId.' 
        });
      }
      
      // Get source and template info
      const source = await storage.getContentSourceById(sourceId);
      const template = await storage.getVideoTemplateById(templateId);
      
      if (!source) {
        return res.status(404).json({ error: 'Content source not found' });
      }
      
      if (!template) {
        return res.status(404).json({ error: 'Video template not found' });
      }
      
      // Create content item
      const contentTitle = `New ${template.name} from ${source.name}`;
      const contentItem = await storage.createContentItem({
        title: contentTitle,
        description: `Automatically generated content using ${template.name} template from ${source.name}`,
        sourceId: source.id,
        originalUrl: `https://example.com/${source.name.toLowerCase().replace(/\s+/g, '-')}`,
        thumbnailUrl: 'https://picsum.photos/600/400',
        mediaType: 'video',
        contentData: {
          generatedAt: new Date().toISOString(),
          sourceName: source.name,
          templateName: template.name
        }
      });
      
      // Create video
      const video = await storage.createVideo({
        title: contentTitle,
        description: `Video generated from ${source.name} using ${template.name} template`,
        contentItemId: contentItem.id,
        templateId: template.id,
        duration: Math.floor(Math.random() * 60) + 30, // Random duration between 30-90 seconds
        videoUrl: 'https://example.com/video.mp4',
        thumbnailUrl: 'https://picsum.photos/600/400',
        status: 'processing'
      });
      
      // Log activity
      await storage.createActivityLog({
        action: 'generate_content',
        status: 'success',
        message: `Started content generation: ${contentTitle}`,
        entityType: 'content_item',
        entityId: contentItem.id,
        details: {
          sourceId,
          templateId,
          videoId: video.id
        }
      });
      
      // Send notification to Slack
      await sendAlertToSlack(
        'Content Generation Started',
        `Started generating content "${contentTitle}" using ${template.name} template from ${source.name}.`,
        'info',
        {
          source: 'content-generator',
          contentItemId: contentItem.id,
          videoId: video.id
        }
      );
      
      // In a real implementation, this would trigger a Make.com workflow
      // For demo purposes, we'll simulate this by updating the video status after a delay
      setTimeout(async () => {
        try {
          // Update video to completed
          await storage.updateVideo(video.id, {
            status: 'ready',
            completedAt: new Date()
          });
          
          // Create social posts
          const platforms = await storage.getSocialPlatforms();
          for (const platform of platforms) {
            await storage.createSocialPost({
              videoId: video.id,
              platformId: platform.id,
              postText: `New content alert! 🎮 ${contentTitle}
Check out our latest ${template.name.toLowerCase()} video created from ${source.name}.`,
              hashtags: '#entertainment #gaming #automation',
              status: 'scheduled',
              scheduledAt: new Date()
            });
          }
          
          // Log completion
          await storage.createActivityLog({
            action: 'video_ready',
            status: 'success',
            message: `Video ready: ${contentTitle}`,
            entityType: 'video',
            entityId: video.id
          });
          
          // Send completion notification to Slack
          await sendAlertToSlack(
            'Video Generation Complete',
            `Successfully generated video "${contentTitle}". Social media posts have been scheduled.`,
            'success',
            {
              source: 'content-generator',
              videoId: video.id,
              socialPlatforms: platforms.length
            }
          );
        } catch (error) {
          console.error('Error in video processing completion:', error);
          
          // Log error
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          
          await storage.createActivityLog({
            action: 'video_generation_error',
            status: 'error',
            message: `Error completing video generation: ${errorMessage}`,
            entityType: 'video',
            entityId: video.id
          });
          
          // Send error alert to Slack
          await sendAlertToSlack(
            'Video Generation Failed',
            `There was an error generating video "${contentTitle}".`,
            'error',
            {
              source: 'content-generator',
              videoId: video.id,
              error: errorMessage
            }
          );
        }
      }, 5000); // 5 second delay to simulate processing
      
      return res.status(201).json({
        success: true,
        message: 'Content generation started',
        title: contentTitle,
        contentItemId: contentItem.id,
        videoId: video.id
      });
    } catch (error) {
      console.error('Error generating content:', error);
      
      // Log error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      await storage.createActivityLog({
        action: 'generate_content_error',
        status: 'error',
        message: `Content generation failed: ${errorMessage}`
      });
      
      // Send error alert to Slack
      await sendAlertToSlack(
        'Content Generation Failed',
        `There was an error starting the content generation process.`,
        'error',
        {
          source: 'content-generator',
          error: errorMessage
        }
      );
      
      return res.status(500).json({ error: 'Failed to generate content' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
