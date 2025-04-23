
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockStats } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const stats = mockStats;
  const navigate = useNavigate();

  const handleCardClick = (status?: string) => {
    let query = "";
    if (status) {
      query = `?status=${status}`;
    }
    navigate(`/bugs${query}`);
  };

  const severityData = [
    { name: "Critical", value: stats.criticalBugs, color: "#EF4444" },
    { name: "High", value: stats.highBugs, color: "#F97316" },
    { name: "Medium", value: stats.mediumBugs, color: "#F59E0B" },
    { name: "Low", value: stats.lowBugs, color: "#10B981" },
  ];
  
  const statusData = [
    { name: "New", value: stats.bugsByStatus.new, color: "#3B82F6" },
    { name: "In Progress", value: stats.bugsByStatus["in-progress"], color: "#F59E0B" },
    { name: "Resolved", value: stats.bugsByStatus.resolved, color: "#10B981" },
    { name: "Closed", value: stats.bugsByStatus.closed, color: "#6B7280" },
  ];

  const developerData = stats.topDevelopers.map((dev, index) => ({
    name: dev.name,
    value: dev.resolvedBugs,
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of bug tracking metrics and statistics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCardClick()}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Bugs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBugs}</div>
            <p className="text-xs text-muted-foreground">
              All bugs in the system
            </p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCardClick("new")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open Bugs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openBugs}</div>
            <p className="text-xs text-muted-foreground">
              Bugs still requiring attention
            </p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCardClick("closed")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Closed Bugs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.closedBugs}</div>
            <p className="text-xs text-muted-foreground">
              Bugs already resolved and closed
            </p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCardClick("critical")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.criticalBugs}</div>
            <p className="text-xs text-muted-foreground">
              High-priority bugs requiring immediate attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Bugs by Status</CardTitle>
            <CardDescription>Distribution of bugs across statuses</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Bugs by Severity</CardTitle>
            <CardDescription>Distribution by priority level</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Bug Resolvers</CardTitle>
          <CardDescription>Developers with most resolved bugs</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={developerData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 40,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" name="Resolved Bugs" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

