import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";

// Pages
import Dashboard from "@/pages/dashboard";
import ContentSources from "@/pages/content-sources";
import VideoTemplates from "@/pages/video-templates";
import SocialMedia from "@/pages/social-media";
import Settings from "@/pages/settings";
import Alerts from "@/pages/alerts";
import ActivityLogs from "@/pages/activity-logs";
import NotFound from "@/pages/not-found";

import { useEffect } from "react";

// Layout component that wraps all pages with common elements
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 overflow-x-hidden overflow-y-auto">
        <MobileHeader />
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

function Router() {
  const [location] = useLocation();
  
  // Add link tracking for navigation
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.getAttribute('href')?.startsWith('#')) {
        // It's an anchor link, not a route, no need to cancel navigation
        return;
      }
    };
    
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);
  
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/content-sources" component={ContentSources} />
        <Route path="/video-templates" component={VideoTemplates} />
        <Route path="/social-media" component={SocialMedia} />
        <Route path="/settings" component={Settings} />
        <Route path="/alerts" component={Alerts} />
        <Route path="/activity-logs" component={ActivityLogs} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
