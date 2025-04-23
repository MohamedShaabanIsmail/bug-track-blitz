
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { BarChart2, Bug, Filter, List } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";

interface SidebarProps {
  className?: string;
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  userRole?: UserRole | UserRole[] | "all";
}

const NavItem = ({ to, icon, label, userRole = "all" }: NavItemProps) => {
  const { currentUser } = useAuth();
  
  if (userRole !== "all" && currentUser) {
    const allowedRoles = Array.isArray(userRole) ? userRole : [userRole];
    if (!allowedRoles.includes(currentUser.role)) {
      return null;
    }
  }
  
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
        )
      }
    >
      {icon}
      {label}
    </NavLink>
  );
};

const Sidebar = ({ className }: SidebarProps) => {
  return (
    <div
      className={cn(
        "flex h-screen w-64 flex-col border-r bg-background",
        className
      )}
    >
      <div className="flex-1 overflow-auto py-6">
        <nav className="space-y-1 px-2">
          <NavItem to="/" icon={<BarChart2 className="h-4 w-4" />} label="Dashboard" />
          <NavItem
            to="/bugs"
            icon={<Bug className="h-4 w-4" />}
            label="Bug List"
          />
          <NavItem
            to="/create"
            icon={<List className="h-4 w-4" />}
            label="New Bug"
          />
        </nav>
      </div>
      
      <div className="border-t p-4">
        <Button variant="outline" className="w-full justify-start" asChild>
          <NavLink to="/settings">
            <Filter className="mr-2 h-4 w-4" />
            Settings
          </NavLink>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;

