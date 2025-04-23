
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import UserAvatar from "./UserAvatar";
import { Bell, Bug } from "lucide-react";

const Header = () => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <Bug className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">BugTracker</h1>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          {currentUser && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <UserAvatar user={currentUser} size="sm" />
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {currentUser.role}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
