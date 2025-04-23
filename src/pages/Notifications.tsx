
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Bell, BellOff, CheckCircle2, RefreshCw } from "lucide-react";

// Sample notification data
const mockNotifications = [
  {
    id: "1",
    title: "New bug assigned",
    message: "You've been assigned to bug #1234: Login button not working",
    date: new Date(Date.now() - 1000 * 60 * 5),
    read: false
  },
  {
    id: "2",
    title: "Bug status updated",
    message: "Bug #5678 has been moved from 'New' to 'In Progress'",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: true
  },
  {
    id: "3",
    title: "Comment on your bug",
    message: "John Doe commented on bug #9012 that you reported",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: false
  },
  {
    id: "4",
    title: "Bug resolved",
    message: "Bug #3456 has been marked as resolved",
    date: new Date(Date.now() - 1000 * 60 * 60 * 48),
    read: true
  },
  {
    id: "5",
    title: "Weekly bug report",
    message: "Your team closed 12 bugs this week. Great job!",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    read: true
  }
];

interface Notification {
  id: string;
  title: string;
  message: string;
  date: Date;
  read: boolean;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [loading, setLoading] = useState(false);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const refreshNotifications = () => {
    setLoading(true);
    // In a real app, this would fetch new notifications
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground">
            Stay updated on bug assignments and status changes
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={refreshNotifications}
            disabled={loading}
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span className="ml-2 hidden sm:inline">Refresh</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCircle2 className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Mark all as read</span>
          </Button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-6">
          <BellOff className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-center text-muted-foreground">No notifications to display</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card 
              key={notification.id}
              className={`transition-colors ${!notification.read ? "border-l-4 border-l-primary" : ""}`}
            >
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex items-start space-x-4">
                  <div className="mt-0.5">
                    <Bell className={`h-5 w-5 ${!notification.read ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{notification.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDistanceToNow(notification.date, { addSuffix: true })}
                    </p>
                  </div>
                </div>
                {!notification.read && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => markAsRead(notification.id)}
                  >
                    Mark as read
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <p>{notification.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
