import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

// Pages
import Dashboard from "@/pages/dashboard";
import ContentSources from "@/pages/content-sources";
import VideoTemplates from "@/pages/video-templates";
import SocialMedia from "@/pages/social-media";
import Settings from "@/pages/settings";
import Alerts from "@/pages/alerts";
import ActivityLogs from "@/pages/activity-logs";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";

import { useEffect } from "react";

// Layout component that wraps all pages with common elements
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Sidebar />
      <main className="md:ml-64 overflow-x-hidden overflow-y-auto transition-all duration-200">
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
    <Switch>
      <Route path="/auth" component={AuthPage} />
      
      <ProtectedRoute path="/" component={() => (
        <Layout>
          <Dashboard />
        </Layout>
      )} />
      
      <ProtectedRoute path="/content-sources" component={() => (
        <Layout>
          <ContentSources />
        </Layout>
      )} />
      
      <ProtectedRoute path="/video-templates" component={() => (
        <Layout>
          <VideoTemplates />
        </Layout>
      )} />
      
      <ProtectedRoute path="/social-media" component={() => (
        <Layout>
          <SocialMedia />
        </Layout>
      )} />
      
      <ProtectedRoute path="/settings" component={() => (
        <Layout>
          <Settings />
        </Layout>
      )} />
      
      <ProtectedRoute path="/alerts" component={() => (
        <Layout>
          <Alerts />
        </Layout>
      )} />
      
      <ProtectedRoute path="/activity-logs" component={() => (
        <Layout>
          <ActivityLogs />
        </Layout>
      )} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
