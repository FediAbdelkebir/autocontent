import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { AlertBanner } from "@/components/dashboard/alert-banner";
import { WorkflowVisualizer } from "@/components/dashboard/workflow-visualizer";
import { ActivityLogComponent } from "@/components/dashboard/activity-log";
import { ContentTable } from "@/components/dashboard/content-table";
import { IntegrationStatus } from "@/components/dashboard/integration-status";
import { TemplateLibrary } from "@/components/dashboard/template-library";
import { ContentGenerator } from "@/components/dashboard/content-generator";
import { Link } from "wouter";
import { formatTimeAgo } from "@/lib/utils";

const Dashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [timeFrame, setTimeFrame] = useState("last_24_hours");
  
  // Fetch dashboard stats
  const { data: stats, isLoading: isLoadingStats, error: statsError } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  // Fetch recent content
  const { data: recentContent, isLoading: isLoadingContent, error: contentError } = useQuery({
    queryKey: ['/api/dashboard/recent-content'],
  });

  // Fetch activity logs
  const { data: activityLogs, isLoading: isLoadingLogs, error: logsError } = useQuery({
    queryKey: ['/api/activity-logs'],
    queryFn: () => fetch('/api/activity-logs?limit=5').then(res => res.json())
  });

  // Fetch alerts
  const { data: alerts, isLoading: isLoadingAlerts, error: alertsError } = useQuery({
    queryKey: ['/api/alerts'],
    queryFn: () => fetch('/api/alerts?limit=1').then(res => res.json())
  });

  // Fetch Make.com integrations
  const { data: makeIntegrations, isLoading: isLoadingIntegrations, error: integrationsError } = useQuery({
    queryKey: ['/api/make-integrations'],
  });

  // Fetch video templates
  const { data: templates, isLoading: isLoadingTemplates, error: templatesError } = useQuery({
    queryKey: ['/api/video-templates'],
  });
  
  // Fetch content sources
  const { data: contentSources, isLoading: isLoadingContentSources, error: contentSourcesError } = useQuery({
    queryKey: ['/api/content-sources'],
  });

  const handleContentGenerationSuccess = () => {
    // Refresh data after successful content generation
    queryClient.invalidateQueries({ queryKey: ['/api/dashboard/recent-content'] });
    queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    queryClient.invalidateQueries({ queryKey: ['/api/activity-logs'] });
  };

  useEffect(() => {
    if (statsError || contentError || logsError || alertsError || integrationsError || templatesError || contentSourcesError) {
      toast({
        title: "Error loading dashboard data",
        description: "There was a problem fetching the dashboard information.",
        variant: "destructive"
      });
    }
  }, [statsError, contentError, logsError, alertsError, integrationsError, templatesError, contentSourcesError, toast]);

  const formatContentItems = () => {
    if (!recentContent || recentContent.length === 0) return [];
    
    return recentContent.map(video => {
      const platforms = video.socialPosts
        ? video.socialPosts.map(post => post.platform.type)
        : [];
      
      return {
        id: video.id,
        title: video.title,
        thumbnailUrl: video.thumbnailUrl,
        source: video.contentItem ? video.contentItem.sourceId : "Unknown",
        format: video.template ? video.template.type : "Unknown",
        platforms,
        status: video.status,
        time: formatTimeAgo(video.createdAt || "")
      };
    });
  };

  const formatMakeIntegrations = () => {
    if (!makeIntegrations || makeIntegrations.length === 0) return [];
    
    return makeIntegrations.map(integration => ({
      name: integration.name,
      icon: "ri-flow-chart",
      lastExecuted: formatTimeAgo(integration.lastExecuted || ""),
      status: integration.status === "active" ? "active" : "error"
    }));
  };

  const formatTemplates = () => {
    if (!templates || templates.length === 0) return [];
    
    const iconMap: Record<string, string> = {
      countdown: "ri-list-check",
      trailer: "ri-movie-2-line",
      news: "ri-newspaper-line",
      gameplay: "ri-gamepad-line"
    };
    
    return templates.map(template => ({
      id: template.id,
      name: template.name,
      description: template.description || "",
      icon: iconMap[template.type] || "ri-video-line"
    }));
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <MobileHeader />

        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Content Automation Dashboard</h1>
              <p className="text-muted-foreground mt-1">Monitor your automated content workflow</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="bg-surface rounded-lg py-1 px-3 flex items-center">
                <span className="text-green-400 flex items-center mr-2">
                  <i className="ri-checkbox-circle-line mr-1"></i>
                  System Active
                </span>
                <span className="text-xs text-muted-foreground">Last update: 2 minutes ago</span>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard 
              title="Videos Created Today" 
              value={isLoadingStats ? "..." : stats?.videosCreatedToday || 0}
              icon="ri-video-line"
              iconColor="primary"
              trend={{
                value: "23%",
                isPositive: true,
                label: "vs. yesterday"
              }}
            />
            
            <StatsCard 
              title="Posts Published" 
              value={isLoadingStats ? "..." : stats?.postsPublished || 0}
              icon="ri-share-line"
              iconColor="secondary"
              trend={{
                value: "18%",
                isPositive: true,
                label: "vs. yesterday"
              }}
            />
            
            <StatsCard 
              title="Content Sources Active" 
              value={isLoadingStats ? "..." : stats?.activeContentSources || 0}
              icon="ri-database-2-line"
              iconColor="warning"
              trend={{
                value: "1",
                isPositive: false,
                label: "source offline"
              }}
            />
            
            <StatsCard 
              title="System Alerts" 
              value={isLoadingStats ? "..." : stats?.systemAlerts || 0}
              icon="ri-error-warning-line"
              iconColor="destructive"
            />
          </div>

          {/* Alert Banner */}
          {!isLoadingAlerts && alerts && alerts.length > 0 && alerts[0].type === "error" && (
            <AlertBanner
              title={alerts[0].title}
              message={alerts[0].message}
              type="error"
              actionLink={{
                text: "View details",
                href: "/alerts"
              }}
              onClose={() => {
                toast({
                  title: "Alert dismissed",
                  description: "You can view all alerts in the Alerts section",
                });
              }}
            />
          )}

          {/* Workflow Status */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            {/* Content Pipeline */}
            <div className="bg-surface rounded-lg p-5 col-span-1 xl:col-span-2">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold">Content Pipeline</h3>
                <select 
                  className="bg-background text-muted-foreground rounded px-2 py-1 text-sm border border-gray-700"
                  value={timeFrame}
                  onChange={(e) => setTimeFrame(e.target.value)}
                >
                  <option value="last_24_hours">Last 24 hours</option>
                  <option value="last_7_days">Last 7 days</option>
                  <option value="last_30_days">Last 30 days</option>
                </select>
              </div>
              
              <WorkflowVisualizer 
                steps={[
                  { name: "Content Ingestion", icon: "ri-database-2-line", status: "active" },
                  { name: "Video Generation", icon: "ri-video-line", status: "active" },
                  { name: "Social Posting", icon: "ri-share-line", status: "error" }
                ]}
                platforms={[
                  { name: "YouTube", icon: "ri-youtube-line", status: "active" },
                  { name: "Instagram", icon: "ri-instagram-line", status: "active" },
                  { name: "TikTok", icon: "ri-tiktok-line", status: "rate_limited" },
                  { name: "X (Twitter)", icon: "ri-twitter-x-line", status: "active" }
                ]}
              />
            </div>
            
            {/* Recent Activities */}
            <div className="bg-surface rounded-lg p-5">
              <ActivityLogComponent 
                logs={activityLogs || []} 
                limit={5}
                onViewAll={() => window.location.href = "/activity-logs"}
              />
            </div>
          </div>

          {/* Recent Content */}
          <div className="bg-surface rounded-lg p-5 mb-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold">Recent Content</h3>
              <Link href="/content-sources" className="text-primary text-sm hover:underline">
                View All
              </Link>
            </div>
            
            <ContentTable items={formatContentItems()} />
          </div>
          
          {/* Content Generator & Make.com Integration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Content Generator */}
            <div className="bg-surface rounded-lg p-5">
              <ContentGenerator 
                contentSources={contentSources || []}
                videoTemplates={templates || []}
                onSuccess={handleContentGenerationSuccess}
              />
            </div>
            
            {/* Make.com Integration Status */}
            <div className="bg-surface rounded-lg p-5">
              <IntegrationStatus 
                integrations={formatMakeIntegrations()}
                connectionStatus="connected"
                onOpenExternal={() => {
                  window.open("https://www.make.com", "_blank");
                }}
              />
            </div>
          </div>
          
          {/* Template Library */}
          <div className="bg-surface rounded-lg p-5 mb-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold">Video Templates</h3>
              <Link href="/video-templates" className="text-primary text-sm hover:underline">
                Manage Templates
              </Link>
            </div>
            
            <TemplateLibrary 
              templates={formatTemplates()}
              onAddTemplate={() => {
                toast({
                  title: "Add Template",
                  description: "Template creation feature coming soon!"
                });
              }}
              onEditTemplate={(id) => {
                toast({
                  title: "Edit Template",
                  description: `Editing template ID: ${id}`
                });
              }}
              onMoreOptions={(id) => {
                toast({
                  title: "Template Options",
                  description: `Options for template ID: ${id}`
                });
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
