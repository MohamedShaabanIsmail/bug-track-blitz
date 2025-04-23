
import { Bug, BugSeverity, BugStatus, Comment, DashboardStats, User, UserRole } from "@/types";

export const users: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    role: "tester",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
  },
  {
    id: "user-3",
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "manager",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
  },
  {
    id: "user-4",
    name: "Sarah Williams",
    email: "sarah@example.com",
    role: "developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    id: "user-5",
    name: "Alex Brown",
    email: "alex@example.com",
    role: "tester",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  },
];

const generateComments = (bugId: string, count: number): Comment[] => {
  const result: Comment[] = [];
  for (let i = 0; i < count; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    result.push({
      id: `comment-${bugId}-${i + 1}`,
      text: `This is a comment on bug #${bugId}. Let me know if you need more information.`,
      userId: user.id,
      user,
      createdAt: new Date(
        Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
      ).toISOString(),
    });
  }
  return result;
};

export const bugs: Bug[] = [
  {
    id: "bug-1",
    title: "Login button not working on Safari",
    description:
      "When users try to log in using Safari browser, the login button doesn't respond to clicks. This issue affects all Safari versions.",
    severity: "high",
    status: "new",
    reportedBy: users[0],
    assignedTo: users[1],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    comments: generateComments("1", 2),
  },
  {
    id: "bug-2",
    title: "Payment processing fails with error code 500",
    description:
      "Customers report that payment processing sometimes fails with a server error 500. This is critical as it affects our revenue stream.",
    severity: "critical",
    status: "in-progress",
    reportedBy: users[0],
    assignedTo: users[3],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    comments: generateComments("2", 3),
  },
  {
    id: "bug-3",
    title: "Profile image upload not working",
    description:
      "Users are unable to upload profile images. The upload button is visible but clicking it does not open a file browser.",
    severity: "medium",
    status: "resolved",
    reportedBy: users[4],
    assignedTo: users[1],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    comments: generateComments("3", 4),
  },
  {
    id: "bug-4",
    title: "Email notifications not being sent",
    description:
      "System is not sending email notifications for new messages. This affects all users across the platform.",
    severity: "high",
    status: "closed",
    reportedBy: users[0],
    assignedTo: users[3],
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    comments: generateComments("4", 5),
  },
  {
    id: "bug-5",
    title: "Button text overflowing on mobile view",
    description:
      "On mobile devices, the text on some buttons is overflowing beyond the button boundaries, making the UI look broken.",
    severity: "low",
    status: "new",
    reportedBy: users[4],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    comments: generateComments("5", 1),
  },
  {
    id: "bug-6",
    title: "Charts not loading in dashboard",
    description:
      "Analytics charts on the dashboard section are not loading. Console shows a JavaScript error related to data parsing.",
    severity: "medium",
    status: "in-progress",
    reportedBy: users[0],
    assignedTo: users[1],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    comments: generateComments("6", 3),
  },
];

export const getCurrentUser = (): User => {
  // In a real app, this would be based on authentication
  return users[2]; // Mike Johnson (manager)
};

export const calculateDashboardStats = (): DashboardStats => {
  const totalBugs = bugs.length;
  const openBugs = bugs.filter((bug) => bug.status !== "closed").length;
  const closedBugs = bugs.filter((bug) => bug.status === "closed").length;
  const criticalBugs = bugs.filter((bug) => bug.severity === "critical").length;
  const highBugs = bugs.filter((bug) => bug.severity === "high").length;
  const mediumBugs = bugs.filter((bug) => bug.severity === "medium").length;
  const lowBugs = bugs.filter((bug) => bug.severity === "low").length;

  const bugsByStatus = {
    new: bugs.filter((bug) => bug.status === "new").length,
    "in-progress": bugs.filter((bug) => bug.status === "in-progress").length,
    resolved: bugs.filter((bug) => bug.status === "resolved").length,
    closed: bugs.filter((bug) => bug.status === "closed").length,
  };

  // Calculate resolved bugs per developer
  const developerResolutionMap: Record<string, number> = {};
  bugs.forEach((bug) => {
    if (bug.status === "resolved" && bug.assignedTo) {
      const devId = bug.assignedTo.id;
      developerResolutionMap[devId] = (developerResolutionMap[devId] || 0) + 1;
    }
  });

  const topDevelopers = Object.entries(developerResolutionMap)
    .map(([devId, count]) => {
      const dev = users.find((u) => u.id === devId);
      return {
        name: dev ? dev.name : "Unknown",
        resolvedBugs: count,
      };
    })
    .sort((a, b) => b.resolvedBugs - a.resolvedBugs)
    .slice(0, 5);

  return {
    totalBugs,
    openBugs,
    closedBugs,
    criticalBugs,
    highBugs,
    mediumBugs,
    lowBugs,
    bugsByStatus,
    topDevelopers,
  };
};

export const mockStats: DashboardStats = calculateDashboardStats();
