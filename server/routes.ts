import type { Express } from "express";
import { createServer, type Server } from "http";
import * as storage from "./storage";
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
          await storage.createAlert({
            title: data.title || 'System Alert',
            message: data.message || 'An issue was detected by Make.com',
            type: data.alertType || 'warning',
            source: 'make.com'
          });
          break;
      }
      
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error processing Make.com webhook:', error);
      return res.status(500).json({ error: 'Failed to process webhook' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
