import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export const MobileHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path ? "sidebar-link-active" : "sidebar-link";
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className="md:hidden bg-surface p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <i className="ri-film-line text-primary text-2xl"></i>
          <h1 className="text-xl font-semibold">AutoContent</h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button 
            type="button" 
            className="text-muted-foreground" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <i className="ri-menu-line text-2xl"></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Menu */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-surface z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <i className="ri-film-line text-primary text-2xl"></i>
            <h1 className="text-xl font-semibold">AutoContent</h1>
          </div>
          <button 
            type="button" 
            className="text-muted-foreground" 
            onClick={toggleMenu}
            aria-label="Close menu"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>
        
        <nav className="mt-6">
          <div className="sidebar-header">
            Main
          </div>
          <Link href="/" className={isActive("/")} onClick={() => setIsMenuOpen(false)}>
            <i className="ri-dashboard-line mr-3"></i>
            <span>Dashboard</span>
          </Link>
          <Link href="/content-sources" className={isActive("/content-sources")} onClick={() => setIsMenuOpen(false)}>
            <i className="ri-film-line mr-3"></i>
            <span>Content Sources</span>
          </Link>
          <Link href="/video-templates" className={isActive("/video-templates")} onClick={() => setIsMenuOpen(false)}>
            <i className="ri-video-line mr-3"></i>
            <span>Video Templates</span>
          </Link>
          <Link href="/social-media" className={isActive("/social-media")} onClick={() => setIsMenuOpen(false)}>
            <i className="ri-share-line mr-3"></i>
            <span>Social Media</span>
          </Link>
          
          <div className="sidebar-header mt-6">
            System
          </div>
          <Link href="/settings" className={isActive("/settings")} onClick={() => setIsMenuOpen(false)}>
            <i className="ri-settings-line mr-3"></i>
            <span>Settings</span>
          </Link>
          <Link href="/alerts" className={isActive("/alerts")} onClick={() => setIsMenuOpen(false)}>
            <i className="ri-notification-line mr-3"></i>
            <span>Alerts</span>
          </Link>
          <Link href="/activity-logs" className={isActive("/activity-logs")} onClick={() => setIsMenuOpen(false)}>
            <i className="ri-history-line mr-3"></i>
            <span>Activity Logs</span>
          </Link>
        </nav>
      </aside>
    </>
  );
};
