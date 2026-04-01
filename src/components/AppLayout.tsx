import { Outlet, useLocation } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import ChatBot from "./ChatBot";
import { Bell, Search, Shield } from "lucide-react";
import { useState } from "react";

const routeLabels: Record<string, string> = {
  "/dashboard": "Security Dashboard",
  "/analyzer": "Message Analyzer",
  "/link-scanner": "Link Scanner",
  "/phone-checker": "Phone Checker",
  "/data": "Data Explorer",
  "/history": "Threat History",
  "/reports": "Reports",
  "/community": "Community Reports",
};

const AppLayout = () => {
  const location = useLocation();
  const pageTitle = routeLabels[location.pathname] ?? "CyberGuard";
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifCount] = useState(3);

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border/30 bg-background/80 backdrop-blur-xl px-6">
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{pageTitle}</p>
          </div>

          {/* Search */}
          <div
            className={`hidden md:flex items-center gap-2 rounded-xl border ${
              searchFocused ? "border-primary/40 bg-card/80" : "border-border/30 bg-muted/30"
            } px-3 py-2 transition-all duration-200 w-56`}
          >
            <Search className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              placeholder="Search threats, reports..."
              className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 outline-none w-full"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>

          {/* Notifications */}
          <button className="relative h-9 w-9 rounded-xl flex items-center justify-center border border-border/30 bg-muted/30 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-card transition-all">
            <Bell className="h-4 w-4" />
            {notifCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 border-2 border-background text-[9px] font-bold text-white flex items-center justify-center">
                {notifCount}
              </span>
            )}
          </button>

          {/* Threat status pill */}
          <div className="hidden md:flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/5 px-3 py-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">Protected</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-8 py-6">
          <Outlet />
        </main>
      </div>

      {/* Global ChatBot */}
      <ChatBot />
    </div>
  );
};

export default AppLayout;
