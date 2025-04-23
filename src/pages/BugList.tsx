
import React, { useState, useEffect } from "react";
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
  SelectGroup,
  SelectItem,
  SelectLabel,
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
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useIsMobile } from "@/hooks/use-mobile";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

type SortField = "title" | "status" | "severity" | "reportedBy" | "assignedTo" | "createdAt";
type SortDirection = "asc" | "desc";

const BugList = () => {
  const { bugs } = useBug();
  const navigate = useNavigate();
  const query = useQuery();
  const isMobile = useIsMobile();

  const initialStatus = query.get("status") as BugStatus | "all" | null;
  const initialSeverity = query.get("severity") as BugSeverity | "all" | null;

  const [statusFilters, setStatusFilters] = useState<BugStatus[]>(
    initialStatus && initialStatus !== "all" ? [initialStatus] : []
  );
  const [severityFilters, setSeverityFilters] = useState<BugSeverity[]>(
    initialSeverity && initialSeverity !== "all" ? [initialSeverity] : []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  useEffect(() => {
    if (initialStatus && initialStatus !== "all" && !statusFilters.includes(initialStatus as BugStatus)) {
      setStatusFilters([initialStatus as BugStatus]);
    }
    if (initialSeverity && initialSeverity !== "all" && !severityFilters.includes(initialSeverity as BugSeverity)) {
      setSeverityFilters([initialSeverity as BugSeverity]);
    }
    // eslint-disable-next-line
  }, [query.get("status"), query.get("severity")]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredBugs = bugs.filter((bug) => {
    const matchesStatus = statusFilters.length === 0 || statusFilters.includes(bug.status);
    const matchesSeverity = severityFilters.length === 0 || severityFilters.includes(bug.severity);
    const matchesSearch =
      searchQuery === "" ||
      bug.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bug.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSeverity && matchesSearch;
  });

  const sortedBugs = [...filteredBugs].sort((a, b) => {
    let valA, valB;

    switch (sortField) {
      case "title":
        valA = a.title;
        valB = b.title;
        break;
      case "status":
        valA = a.status;
        valB = b.status;
        break;
      case "severity":
        // Custom order: Critical > High > Medium > Low
        const severityOrder = { critical: 3, high: 2, medium: 1, low: 0 };
        valA = severityOrder[a.severity] || 0;
        valB = severityOrder[b.severity] || 0;
        break;
      case "reportedBy":
        valA = a.reportedBy.name;
        valB = b.reportedBy.name;
        break;
      case "assignedTo":
        valA = a.assignedTo?.name || "";
        valB = b.assignedTo?.name || "";
        break;
      case "createdAt":
        valA = new Date(a.createdAt).getTime();
        valB = new Date(b.createdAt).getTime();
        break;
      default:
        valA = a[sortField];
        valB = b[sortField];
    }

    if (valA < valB) return sortDirection === "asc" ? -1 : 1;
    if (valA > valB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleRowClick = (bugId: string) => {
    navigate(`/bugs/${bugId}`);
  };

  const handleStatusChange = (status: BugStatus) => {
    if (statusFilters.includes(status)) {
      setStatusFilters(statusFilters.filter(s => s !== status));
    } else {
      setStatusFilters([...statusFilters, status]);
    }
  };

  const handleSeverityChange = (severity: BugSeverity) => {
    if (severityFilters.includes(severity)) {
      setSeverityFilters(severityFilters.filter(s => s !== severity));
    } else {
      setSeverityFilters([...severityFilters, severity]);
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? <ChevronUp className="h-4 w-4 inline" /> : <ChevronDown className="h-4 w-4 inline" />;
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

        <div className={`flex ${isMobile ? "flex-col space-y-2" : "items-center space-x-2"}`}>
          <Select>
            <SelectTrigger className={`${isMobile ? "w-full" : "w-[180px]"}`}>
              <SelectValue placeholder={`Status (${statusFilters.length || "All"})`} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status Filters</SelectLabel>
                {(["new", "in-progress", "resolved", "closed"] as BugStatus[]).map((status) => (
                  <div key={status} className="flex items-center space-x-2 pl-4 pr-1 py-1.5">
                    <Checkbox 
                      id={`status-${status}`} 
                      checked={statusFilters.includes(status)}
                      onCheckedChange={() => handleStatusChange(status)}
                    />
                    <label htmlFor={`status-${status}`} className="flex-1 cursor-pointer">
                      <BugStatusBadge status={status} />
                    </label>
                  </div>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className={`${isMobile ? "w-full" : "w-[180px]"}`}>
              <SelectValue placeholder={`Severity (${severityFilters.length || "All"})`} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Severity Filters</SelectLabel>
                {(["critical", "high", "medium", "low"] as BugSeverity[]).map((severity) => (
                  <div key={severity} className="flex items-center space-x-2 pl-4 pr-1 py-1.5">
                    <Checkbox 
                      id={`severity-${severity}`} 
                      checked={severityFilters.includes(severity)}
                      onCheckedChange={() => handleSeverityChange(severity)}
                    />
                    <label htmlFor={`severity-${severity}`} className="flex-1 cursor-pointer">
                      <BugSeverityBadge severity={severity} />
                    </label>
                  </div>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("title")} className="cursor-pointer">
                Title <SortIcon field="title" />
              </TableHead>
              <TableHead onClick={() => handleSort("status")} className="hidden md:table-cell cursor-pointer">
                Status <SortIcon field="status" />
              </TableHead>
              <TableHead onClick={() => handleSort("severity")} className="hidden md:table-cell cursor-pointer">
                Severity <SortIcon field="severity" />
              </TableHead>
              <TableHead onClick={() => handleSort("reportedBy")} className="hidden lg:table-cell cursor-pointer">
                Reported By <SortIcon field="reportedBy" />
              </TableHead>
              <TableHead onClick={() => handleSort("assignedTo")} className="hidden lg:table-cell cursor-pointer">
                Assigned To <SortIcon field="assignedTo" />
              </TableHead>
              <TableHead onClick={() => handleSort("createdAt")} className="hidden sm:table-cell cursor-pointer">
                Created <SortIcon field="createdAt" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedBugs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No bugs found.
                </TableCell>
              </TableRow>
            ) : (
              sortedBugs.map((bug) => (
                <TableRow
                  key={bug.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(bug.id)}
                >
                  <TableCell className="font-medium">
                    <div className="md:hidden mb-1">
                      <BugStatusBadge status={bug.status} />
                      <span className="ml-2">
                        <BugSeverityBadge severity={bug.severity} />
                      </span>
                    </div>
                    {bug.title}
                    <div className="block md:hidden text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(bug.createdAt), { addSuffix: true })}
                    </div>
                  </TableCell>
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
