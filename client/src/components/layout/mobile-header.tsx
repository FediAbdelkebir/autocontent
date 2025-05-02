import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { UserProfile } from "@/components/layout/user-profile";
import { useMobile } from "@/hooks/use-mobile";

export const MobileHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const isMobile = useMobile();

  // Close mobile menu when switching to desktop
  useEffect(() => {
    if (!isMobile && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isMobile, isMenuOpen]);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const isActive = (path: string) => {
    return location === path ? "sidebar-link-active" : "sidebar-link";
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-white dark:bg-gray-900 p-4 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2">
          <i className="ri-film-line text-primary text-2xl"></i>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">AutoContent</h1>
        </div>
        <div className="flex items-center gap-3">
          <UserProfile />
          <ThemeToggle />
          <button 
            type="button" 
            className="text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 p-2 rounded-md border border-gray-200 dark:border-gray-700" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <i className={`${isMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-xl`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* Mobile Menu */}
      <div 
        className={`fixed top-0 left-0 h-screen w-4/5 max-w-xs bg-white dark:bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out md:hidden overflow-y-auto ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <i className="ri-film-line text-primary text-2xl"></i>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">AutoContent</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
        
        <nav className="pt-3 pb-20"> {/* Extra padding at bottom for scrolling on small devices */}
          <div className="sidebar-header">
            Main
          </div>
          <Link href="/" className={isActive("/")} onClick={() => setIsMenuOpen(false)}>
            <i className="ri-dashboard-line mr-3 text-lg"></i>
            <span>Dashboard</span>
          </Link>
          <Link href="/content-sources" className={isActive("/content-sources")} onClick={() => setIsMenuOpen(false)}>
            <i className="ri-film-line mr-3 text-lg"></i>
            <span>Content Sources</span>
          </Link>
          <Link href="/video-templates" className={isActive("/video-templates")} onClick={() => setIsMenuOpen(false)}>
            <i className="ri-video-line mr-3 text-lg"></i>
            <span>Video Templates</span>
          </Link>
          <Link href="/social-media" className={isActive("/social-media")} onClick={() => setIsMenuOpen(false)}>
            <i className="ri-share-line mr-3 text-lg"></i>
            <span>Social Media</span>
          </Link>
          
          <div className="sidebar-header mt-6">
            System
          </div>
          <Link href="/settings" className={isActive("/settings")} onClick={() => setIsMenuOpen(false)}>
            <i className="ri-settings-line mr-3 text-lg"></i>
            <span>Settings</span>
          </Link>
          <Link href="/alerts" className={isActive("/alerts")} onClick={() => setIsMenuOpen(false)}>
            <i className="ri-notification-line mr-3 text-lg"></i>
            <span>Alerts</span>
            {/* Example of alert badge */}
            <span className="ml-auto bg-destructive text-destructive-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">1</span>
          </Link>
          <Link href="/activity-logs" className={isActive("/activity-logs")} onClick={() => setIsMenuOpen(false)}>
            <i className="ri-history-line mr-3 text-lg"></i>
            <span>Activity Logs</span>
          </Link>
          
          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mx-3 mb-3 text-sm">
            <div className="font-medium mb-1 text-gray-900 dark:text-white">Need help?</div>
            <p className="text-gray-600 dark:text-gray-300 text-xs mb-2">Check out our documentation for help using the platform.</p>
            <a href="#" className="text-primary text-xs hover:underline">View Documentation</a>
          </div>
        </nav>
      </div>
    </>
  );
};
