import { Link, useLocation } from "react-router-dom";
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
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/analyzer", label: "Message Analyzer", icon: MessageSquareWarning },
  { path: "/link-scanner", label: "Link Scanner", icon: Link2 },
  { path: "/phone-checker", label: "Phone Checker", icon: Phone },
  { path: "/data", label: "Data Explorer", icon: FileBarChart },
  { path: "/history", label: "Threat History", icon: History },
  { path: "/reports", label: "Reports", icon: FileBarChart },
  { path: "/community", label: "Community Reports", icon: Flag },
];

const AppSidebar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-sidebar">
      <div className="flex h-16 items-center gap-3 px-6">
        <Shield className="h-7 w-7 text-primary" />
        <span className="text-lg font-bold tracking-tight text-foreground">
          CyberGuard
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4 space-y-3">
        <div className="rounded-lg bg-muted p-3">
          <p className="label-caps mb-1">Signed in as</p>
          <p className="text-xs text-foreground truncate">{user?.email}</p>
        </div>
        <Button variant="outline" size="sm" className="w-full" onClick={signOut}>
          <LogOut className="mr-2 h-3.5 w-3.5" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
};

export default AppSidebar;
