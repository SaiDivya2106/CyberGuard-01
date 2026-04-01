import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  LayoutDashboard,
  MessageSquareWarning,
  Link2,
  Phone,
  History,
  FileBarChart,
  Flag,
  LogOut,
  Wifi,
  User,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
  { path: "/analyzer", label: "Message Analyzer", icon: MessageSquareWarning, badge: "New" },
  { path: "/link-scanner", label: "Link Scanner", icon: Link2, badge: null },
  { path: "/phone-checker", label: "Phone Checker", icon: Phone, badge: null },
  { path: "/data", label: "Data Explorer", icon: FileBarChart, badge: null },
  { path: "/history", label: "Threat History", icon: History, badge: "3" },
  { path: "/reports", label: "Reports", icon: FileBarChart, badge: null },
  { path: "/community", label: "Community Reports", icon: Flag, badge: "12" },
];

const AppSidebar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "GU";

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border/50 bg-sidebar/90 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5 border-b border-border/30">
        <motion.div
          initial={{ rotate: -15, scale: 0.8, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-full bg-primary/40 blur-md" />
          <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-primary/30 to-blue-500/10 border border-primary/30 flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary" />
          </div>
        </motion.div>
        <div>
          <span className="text-sm font-extrabold tracking-wider text-foreground uppercase bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
            CyberGuard
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[9px] font-bold tracking-widest uppercase text-green-400/80">Systems Active</span>
          </div>
        </div>
      </div>

      {/* — Status bar */}
      <div className="mx-3 mt-3 mb-1 flex items-center justify-between rounded-xl bg-primary/5 border border-primary/10 px-3 py-2">
        <div className="flex items-center gap-2">
          <Wifi className="h-3.5 w-3.5 text-primary" />
          <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Threat Monitor</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[9px] text-green-400 font-bold">Live</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3 py-4 overflow-y-auto">
        <p className="px-3 pb-2 text-[9px] font-bold tracking-widest uppercase text-muted-foreground/50">Navigation</p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className="relative group block">
              <motion.div
                whileHover={{ x: 3 }}
                transition={{ duration: 0.15 }}
                className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-primary/15 to-primary/5 text-primary border border-primary/20 shadow-[0_0_15px_rgba(0,122,255,0.08)]"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/40 hover:text-sidebar-accent-foreground"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-primary to-blue-400 rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <item.icon
                  className={`h-4 w-4 transition-colors flex-shrink-0 ${
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary/70"
                  }`}
                />
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    item.badge === "New"
                      ? "bg-primary/20 text-primary border border-primary/20"
                      : "bg-red-500/20 text-red-400 border border-red-500/20"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom user card */}
      <div className="border-t border-border/30 p-3 space-y-2">
        <div className="flex items-center gap-3 rounded-xl bg-card/50 border border-border/30 p-3">
          <div className="relative">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/30 to-blue-800/40 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              {initials}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-background border-2 border-background flex items-center justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">{user?.email ? user.email.split("@")[0] : "Guest User"}</p>
            <p className="text-[10px] text-muted-foreground truncate">{user?.email || "guest@cyberguard.io"}</p>
          </div>
          <User className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full rounded-xl border-border/30 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all font-medium text-[11px] h-8"
          onClick={signOut}
        >
          <LogOut className="mr-2 h-3.5 w-3.5" />
          Terminate Session
        </Button>
      </div>
    </aside>
  );
};

export default AppSidebar;
