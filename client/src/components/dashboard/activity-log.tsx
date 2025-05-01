import { ActivityLog } from "@shared/schema";
import { formatTimeAgo, getActivityIconClass } from "@/lib/utils";

interface ActivityLogProps {
  logs: ActivityLog[];
  limit?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

export const ActivityLogComponent = ({ 
  logs = [], 
  limit = 5,
  showViewAll = true,
  onViewAll
}: ActivityLogProps) => {
  // Limit the number of logs to display
  const limitedLogs = logs.slice(0, limit);

  return (
    <div>
      {showViewAll && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold">Recent Activities</h3>
          {onViewAll && (
            <a href="#" className="text-primary text-sm hover:underline" onClick={(e) => {
              e.preventDefault();
              onViewAll();
            }}>View All</a>
          )}
        </div>
      )}
      
      <div className="space-y-4">
        {limitedLogs.length > 0 ? (
          limitedLogs.map((log, index) => (
            <div className={getActivityIconClass(log.status)} key={index}>
              <div className="flex justify-between">
                <p className="font-medium">{log.action.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
                <span className="text-muted-foreground text-xs">
                  {formatTimeAgo(log.timestamp)}
                </span>
              </div>
              <p className="text-muted-foreground text-sm mt-1">{log.message}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No activity logs found</p>
          </div>
        )}
      </div>
    </div>
  );
};
