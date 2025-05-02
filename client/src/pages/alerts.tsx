import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { apiRequest } from "@/lib/queryClient";
import { formatTimeAgo } from "@/lib/utils";
import { Alert } from "@shared/schema";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertBanner } from "@/components/dashboard/alert-banner";

const Alerts = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("active");

  // Fetch active alerts
  const { data: activeAlerts, isLoading: isLoadingActive, error: activeError } = useQuery({
    queryKey: ['/api/alerts', 'active'],
    queryFn: () => fetch('/api/alerts?resolved=false').then(res => res.json())
  });

  // Fetch resolved alerts
  const { data: resolvedAlerts, isLoading: isLoadingResolved, error: resolvedError } = useQuery({
    queryKey: ['/api/alerts', 'resolved'],
    queryFn: () => fetch('/api/alerts?resolved=true').then(res => res.json())
  });

  // Resolve alert mutation
  const resolveMutation = useMutation({
    mutationFn: (alertId: number) => {
      return apiRequest("PUT", `/api/alerts/${alertId}/resolve`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts', 'active'] });
      queryClient.invalidateQueries({ queryKey: ['/api/alerts', 'resolved'] });
      toast({
        title: "Alert resolved",
        description: "The alert has been marked as resolved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error resolving alert",
        description: error.message || "There was a problem resolving the alert.",
        variant: "destructive",
      });
    }
  });

  const getAlertTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "error":
        return "ri-error-warning-line";
      case "warning":
        return "ri-alert-line";
      case "info":
      default:
        return "ri-information-line";
    }
  };

  const getAlertTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "error":
        return "text-destructive";
      case "warning":
        return "text-[#FFD740]";
      case "info":
      default:
        return "text-primary";
    }
  };

  const getAlertTypeBg = (type: string) => {
    switch (type.toLowerCase()) {
      case "error":
        return "bg-destructive bg-opacity-10";
      case "warning":
        return "bg-[#FFD740] bg-opacity-10";
      case "info":
      default:
        return "bg-primary bg-opacity-10";
    }
  };

  const handleResolveAll = () => {
    if (!activeAlerts || activeAlerts.length === 0) return;
    
    if (window.confirm("Are you sure you want to resolve all active alerts?")) {
      // We could do this with Promise.all, but for simplicity let's just use the first alert as an example
      toast({
        title: "Resolving all alerts",
        description: `Resolving ${activeAlerts.length} alerts...`,
      });
      
      // In a real implementation, we would have a batch resolve endpoint
      // or use Promise.all to resolve them one by one
      activeAlerts.forEach((alert: Alert) => {
        resolveMutation.mutate(alert.id);
      });
    }
  };

  const renderAlertCard = (alert: Alert) => (
    <Card key={alert.id} className="bg-surface mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <i className={`${getAlertTypeIcon(alert.type)} ${getAlertTypeColor(alert.type)} text-2xl mr-3`}></i>
            <CardTitle>{alert.title}</CardTitle>
          </div>
          <div className="text-xs text-muted-foreground">
            {formatTimeAgo(alert.createdAt)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{alert.message}</p>
        {alert.source && (
          <div className="mt-2 text-xs text-muted-foreground">
            Source: {alert.source}
          </div>
        )}
      </CardContent>
      {!alert.isResolved && (
        <CardFooter>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => resolveMutation.mutate(alert.id)}
            disabled={resolveMutation.isPending}
          >
            {resolveMutation.isPending && (
              <i className="ri-loader-4-line animate-spin mr-2"></i>
            )}
            Mark as Resolved
          </Button>
        </CardFooter>
      )}
    </Card>
  );

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <MobileHeader />

        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">System Alerts</h1>
              <p className="text-muted-foreground mt-1">View and manage system alerts and notifications</p>
            </div>
            <div className="mt-4 md:mt-0">
              {activeAlerts && activeAlerts.length > 0 && (
                <Button 
                  variant="outline" 
                  onClick={handleResolveAll}
                  disabled={resolveMutation.isPending}
                >
                  {resolveMutation.isPending && (
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                  )}
                  Resolve All
                </Button>
              )}
            </div>
          </div>

          {(activeError || resolvedError) && (
            <AlertBanner
              title="Error loading alerts"
              message="There was a problem fetching the system alerts. Please try again."
              type="error"
            />
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
              <TabsTrigger value="active">
                Active Alerts
                {activeAlerts && activeAlerts.length > 0 && (
                  <span className="ml-2 bg-destructive text-white rounded-full px-2 py-0.5 text-xs">
                    {activeAlerts.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>
            
            {/* Active Alerts Tab */}
            <TabsContent value="active">
              {isLoadingActive ? (
                <div className="flex justify-center items-center py-10">
                  <i className="ri-loader-4-line animate-spin text-2xl mr-2"></i>
                  <span>Loading alerts...</span>
                </div>
              ) : activeAlerts && activeAlerts.length > 0 ? (
                <div>
                  {activeAlerts.map((alert: Alert) => renderAlertCard(alert))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 bg-surface rounded-lg">
                  <i className="ri-checkbox-circle-fill text-secondary text-5xl mb-4"></i>
                  <h3 className="text-lg font-medium mb-2">No Active Alerts</h3>
                  <p className="text-muted-foreground text-center">
                    All systems are running normally. There are no active alerts at this time.
                  </p>
                </div>
              )}
            </TabsContent>
            
            {/* Resolved Alerts Tab */}
            <TabsContent value="resolved">
              {isLoadingResolved ? (
                <div className="flex justify-center items-center py-10">
                  <i className="ri-loader-4-line animate-spin text-2xl mr-2"></i>
                  <span>Loading resolved alerts...</span>
                </div>
              ) : resolvedAlerts && resolvedAlerts.length > 0 ? (
                <div>
                  {resolvedAlerts.map((alert: Alert) => renderAlertCard(alert))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 bg-surface rounded-lg">
                  <i className="ri-history-line text-muted-foreground text-5xl mb-4"></i>
                  <h3 className="text-lg font-medium mb-2">No Resolved Alerts</h3>
                  <p className="text-muted-foreground text-center">
                    There are no resolved alerts in the history.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Alerts;
