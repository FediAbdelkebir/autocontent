import { Link, useLocation } from "wouter";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export const Sidebar = () => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path ? "sidebar-link-active" : "sidebar-link";
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 hidden md:flex md:flex-col border-r border-gray-200 dark:border-gray-800 h-screen fixed left-0 top-0">
      <div className="p-5 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <i className="ri-film-line text-primary text-2xl"></i>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">AutoContent</h1>
          </div>
          <ThemeToggle />
        </div>
      </div>
      
      <nav className="mt-4 flex flex-col h-[calc(100vh-160px)] overflow-y-auto">
        <div className="sidebar-header">
          Main
        </div>
        <Link href="/" className={isActive("/")}>
          <i className="ri-dashboard-line mr-3 text-lg"></i>
          <span>Dashboard</span>
        </Link>
        <Link href="/content-sources" className={isActive("/content-sources")}>
          <i className="ri-film-line mr-3 text-lg"></i>
          <span>Content Sources</span>
        </Link>
        <Link href="/video-templates" className={isActive("/video-templates")}>
          <i className="ri-video-line mr-3 text-lg"></i>
          <span>Video Templates</span>
        </Link>
        <Link href="/social-media" className={isActive("/social-media")}>
          <i className="ri-share-line mr-3 text-lg"></i>
          <span>Social Media</span>
        </Link>
        
        <div className="sidebar-header mt-6">
          System
        </div>
        <Link href="/settings" className={isActive("/settings")}>
          <i className="ri-settings-line mr-3 text-lg"></i>
          <span>Settings</span>
        </Link>
        <Link href="/alerts" className={isActive("/alerts")}>
          <i className="ri-notification-line mr-3 text-lg"></i>
          <span>Alerts</span>
          {/* Example of alert badge */}
          <span className="ml-auto bg-destructive text-destructive-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">1</span>
        </Link>
        <Link href="/activity-logs" className={isActive("/activity-logs")}>
          <i className="ri-history-line mr-3 text-lg"></i>
          <span>Activity Logs</span>
        </Link>
        
        <div className="mt-auto p-4 bg-muted rounded-lg mx-3 mb-3 text-sm">
          <div className="font-medium mb-1">Need help?</div>
          <p className="text-muted-foreground text-xs mb-2">Check out our documentation for help using the platform.</p>
          <a href="#" className="text-primary text-xs hover:underline">View Documentation</a>
        </div>
      </nav>
    </aside>
  );
};
