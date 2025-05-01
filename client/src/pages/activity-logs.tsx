import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { AlertBanner } from "@/components/dashboard/alert-banner";
import { formatTimeAgo, getActivityIconClass } from "@/lib/utils";
import { ActivityLog } from "@shared/schema";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const ActivityLogs = () => {
  const [limit, setLimit] = useState(50);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch activity logs
  const { data: activityLogs, isLoading, error } = useQuery({
    queryKey: ['/api/activity-logs', limit, statusFilter],
    queryFn: () => {
      let url = `/api/activity-logs?limit=${limit}`;
      if (statusFilter !== "all") {
        url += `&status=${statusFilter}`;
      }
      return fetch(url).then(res => res.json());
    }
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return "text-secondary";
      case "warning":
        return "text-[#FFD740]";
      case "error":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes("video")) return "ri-video-line";
    if (action.includes("content")) return "ri-file-list-line";
    if (action.includes("social") || action.includes("post")) return "ri-share-line";
    if (action.includes("alert")) return "ri-alert-line";
    if (action.includes("error")) return "ri-error-warning-line";
    return "ri-history-line";
  };

  // Filter logs by search term
  const filteredLogs = searchTerm && activityLogs
    ? activityLogs.filter((log: ActivityLog) => 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.details && JSON.stringify(log.details).toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : activityLogs;

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <MobileHeader />

        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Activity Logs</h1>
              <p className="text-muted-foreground mt-1">View a history of all system activities</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button variant="outline">
                <i className="ri-download-line mr-2"></i>
                Export Logs
              </Button>
            </div>
          </div>

          {error && (
            <AlertBanner
              title="Error loading logs"
              message="There was a problem fetching the activity logs. Please try again."
              type="error"
            />
          )}

          <div className="bg-surface rounded-lg p-5 mb-6">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="w-full md:w-48">
                <Select 
                  value={statusFilter} 
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-48">
                <Select 
                  value={limit.toString()} 
                  onValueChange={(value) => setLimit(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Show entries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">20 Entries</SelectItem>
                    <SelectItem value="50">50 Entries</SelectItem>
                    <SelectItem value="100">100 Entries</SelectItem>
                    <SelectItem value="200">200 Entries</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <div className="flex justify-center items-center">
                        <i className="ri-loader-4-line animate-spin text-2xl mr-2"></i>
                        <span>Loading activity logs...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredLogs && filteredLogs.length > 0 ? (
                  filteredLogs.map((log: ActivityLog) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <i className={`${getActionIcon(log.action)} mr-2 ${getStatusColor(log.status)}`}></i>
                          <span>{log.action.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={getStatusColor(log.status)}>
                          {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate" title={log.message}>
                        {log.message}
                      </TableCell>
                      <TableCell>
                        {log.entityType ? (
                          <span>
                            {log.entityType.charAt(0).toUpperCase() + log.entityType.slice(1)} 
                            {log.entityId ? ` #${log.entityId}` : ''}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {formatTimeAgo(log.timestamp)}
                      </TableCell>
                      <TableCell className="text-right">
                        {log.details ? (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              alert(JSON.stringify(log.details, null, 2));
                            }}
                          >
                            <i className="ri-information-line"></i>
                          </Button>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <p className="text-muted-foreground">
                        {searchTerm 
                          ? "No matching logs found. Try changing your search criteria." 
                          : "No activity logs found."}
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            {filteredLogs && filteredLogs.length > 0 && (
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredLogs.length} of {limit} entries
                  {searchTerm && ` (filtered from ${activityLogs?.length || 0} total)`}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setLimit(prev => prev + 50);
                  }}
                  disabled={filteredLogs.length < limit}
                >
                  Load More
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ActivityLogs;
