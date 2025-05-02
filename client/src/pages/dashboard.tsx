import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { StatsCard } from "@/components/dashboard/stats-card";
import { AlertBanner } from "@/components/dashboard/alert-banner";
import { WorkflowVisualizer } from "@/components/dashboard/workflow-visualizer";
import { ActivityLogComponent } from "@/components/dashboard/activity-log";
import { ContentTable } from "@/components/dashboard/content-table";
import { IntegrationStatus } from "@/components/dashboard/integration-status";
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

  const handleResolveAlert = (alertId: number) => {
    fetch(`/api/alerts/${alertId}/resolve`, { method: 'POST' })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
        toast({
          title: "Alert resolved",
          description: "The alert has been marked as resolved"
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to resolve the alert",
          variant: "destructive"
        });
      });
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
    if (!recentContent || !Array.isArray(recentContent) || recentContent.length === 0) return [];
    
    return recentContent.map((video: any) => {
      const platforms = video.socialPosts
        ? video.socialPosts.map((post: any) => post.platform.type)
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
    if (!makeIntegrations || !Array.isArray(makeIntegrations) || makeIntegrations.length === 0) return [];
    
    return makeIntegrations.map((integration: any) => {
      // Ensure status is one of the expected values
      let status: "active" | "warning" | "error";
      if (integration.status === "active") {
        status = "active";
      } else if (integration.status === "warning") {
        status = "warning";
      } else {
        status = "error";
      }
      
      return {
        name: integration.name,
        icon: "ri-flow-chart",
        lastExecuted: formatTimeAgo(integration.lastExecuted || ""),
        status
      };
    });
  };

  return (
    <>
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
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4 mb-6">
        <h3 className="font-bold text-lg mb-4">Overview Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            title="Videos Created Today" 
            value={isLoadingStats ? "..." : (stats as any)?.videosCreatedToday || 0}
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
            value={isLoadingStats ? "..." : (stats as any)?.postsPublished || 0}
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
            value={isLoadingStats ? "..." : (stats as any)?.activeContentSources || 0}
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
            value={isLoadingStats ? "..." : (stats as any)?.systemAlerts || 0}
            icon="ri-error-warning-line"
            iconColor="destructive"
          />
        </div>
      </div>

      {/* Alert Banner */}
      {!isLoadingAlerts && alerts && Array.isArray(alerts) && alerts.length > 0 && alerts[0].type === "error" && (
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

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        {/* Left Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Content Generator */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-5">
            <div className="mb-5">
              <h3 className="font-bold text-lg">Generate New Content</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Create new video content with just a few clicks</p>
            </div>
            <ContentGenerator 
              contentSources={Array.isArray(contentSources) ? contentSources : []}
              videoTemplates={Array.isArray(templates) ? templates : []}
              onSuccess={handleContentGenerationSuccess}
            />
          </div>

          {/* Recent Content */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="font-bold text-lg">Recent Content</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Your latest generated content</p>
              </div>
              <Link href="/content-sources" className="text-primary text-sm hover:underline">
                View All
              </Link>
            </div>
            <ContentTable items={formatContentItems().slice(0, 3)} />
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Workflow Status */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-lg">System Status</h3>
              <select 
                className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded px-2 py-1 text-sm border border-gray-200 dark:border-gray-700"
                value={timeFrame}
                onChange={(e) => setTimeFrame(e.target.value)}
              >
                <option value="last_24_hours">Last 24h</option>
                <option value="last_7_days">Last 7d</option>
                <option value="last_30_days">Last 30d</option>
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
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-lg">Activity Log</h3>
              <Link href="/activity-logs" className="text-primary text-sm hover:underline">
                View All
              </Link>
            </div>
            <ActivityLogComponent 
              logs={Array.isArray(activityLogs) ? activityLogs : []} 
              limit={4}
              showViewAll={false}
            />
          </div>
          
          {/* Make.com Integration Status */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-5">
            <IntegrationStatus 
              integrations={formatMakeIntegrations()}
              connectionStatus="connected"
              onOpenExternal={() => {
                window.open("https://www.make.com", "_blank");
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
