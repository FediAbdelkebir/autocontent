import { Link, useLocation } from "wouter";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export const Sidebar = () => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path ? "sidebar-link-active" : "sidebar-link";
  };

  return (
    <aside className="w-64 bg-surface hidden md:block">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <i className="ri-film-line text-primary text-2xl"></i>
            <h1 className="text-xl font-semibold">AutoContent</h1>
          </div>
          <ThemeToggle />
        </div>
      </div>
      
      <nav className="mt-6">
        <div className="sidebar-header">
          Main
        </div>
        <Link href="/" className={isActive("/")}>
          <i className="ri-dashboard-line mr-3"></i>
          <span>Dashboard</span>
        </Link>
        <Link href="/content-sources" className={isActive("/content-sources")}>
          <i className="ri-film-line mr-3"></i>
          <span>Content Sources</span>
        </Link>
        <Link href="/video-templates" className={isActive("/video-templates")}>
          <i className="ri-video-line mr-3"></i>
          <span>Video Templates</span>
        </Link>
        <Link href="/social-media" className={isActive("/social-media")}>
          <i className="ri-share-line mr-3"></i>
          <span>Social Media</span>
        </Link>
        
        <div className="sidebar-header mt-6">
          System
        </div>
        <Link href="/settings" className={isActive("/settings")}>
          <i className="ri-settings-line mr-3"></i>
          <span>Settings</span>
        </Link>
        <Link href="/alerts" className={isActive("/alerts")}>
          <i className="ri-notification-line mr-3"></i>
          <span>Alerts</span>
        </Link>
        <Link href="/activity-logs" className={isActive("/activity-logs")}>
          <i className="ri-history-line mr-3"></i>
          <span>Activity Logs</span>
        </Link>
      </nav>
    </aside>
  );
};
