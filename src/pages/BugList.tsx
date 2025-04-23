
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useBug } from "@/context/BugContext";
import { useNavigate, useLocation } from "react-router-dom";
import BugStatusBadge from "@/components/BugStatusBadge";
import BugSeverityBadge from "@/components/BugSeverityBadge";
import UserAvatar from "@/components/UserAvatar";
import { Bug, BugSeverity, BugStatus } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Search } from "lucide-react";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const BugList = () => {
  const { bugs } = useBug();
  const navigate = useNavigate();
  const query = useQuery();

  const initialStatus = query.get("status") as BugStatus | "all" | null;
  const initialSeverity = query.get("severity") as BugSeverity | "all" | null;

  const [statusFilter, setStatusFilter] = useState<BugStatus | "all">(initialStatus || "all");
  const [severityFilter, setSeverityFilter] = useState<BugSeverity | "all">(initialSeverity || "all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (initialStatus && initialStatus !== statusFilter) {
      setStatusFilter(initialStatus);
    }
    if (initialSeverity && initialSeverity !== severityFilter) {
      setSeverityFilter(initialSeverity);
    }
    // eslint-disable-next-line
  }, [query.get("status"), query.get("severity")]);

  const filteredBugs = bugs.filter((bug) => {
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "critical"
        ? bug.severity === "critical"
        : bug.status === statusFilter);
    const matchesSeverity = severityFilter === "all" || bug.severity === severityFilter;
    const matchesSearch =
      searchQuery === "" ||
      bug.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bug.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSeverity && matchesSearch;
  });

  const handleRowClick = (bugId: string) => {
    navigate(`/bugs/${bugId}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Bug List</h2>
        <p className="text-muted-foreground">
          View and filter all reported bugs
        </p>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bugs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8"
            />
          </div>
          <Button variant="outline" onClick={() => navigate("/create")}>
            New Bug
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as BugStatus | "all")}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={severityFilter}
            onValueChange={(value) => setSeverityFilter(value as BugSeverity | "all")}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Severity</TableHead>
              <TableHead className="hidden lg:table-cell">Reported By</TableHead>
              <TableHead className="hidden lg:table-cell">Assigned To</TableHead>
              <TableHead className="hidden sm:table-cell">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBugs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No bugs found.
                </TableCell>
              </TableRow>
            ) : (
              filteredBugs.map((bug) => (
                <TableRow
                  key={bug.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(bug.id)}
                >
                  <TableCell className="font-medium">{bug.title}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <BugStatusBadge status={bug.status} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <BugSeverityBadge severity={bug.severity} />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center">
                      <UserAvatar user={bug.reportedBy} size="sm" />
                      <span className="ml-2">{bug.reportedBy.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {bug.assignedTo ? (
                      <div className="flex items-center">
                        <UserAvatar user={bug.assignedTo} size="sm" />
                        <span className="ml-2">{bug.assignedTo.name}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {formatDistanceToNow(new Date(bug.createdAt), { addSuffix: true })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BugList;

