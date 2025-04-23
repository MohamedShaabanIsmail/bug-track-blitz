
import { BugStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BugStatusBadgeProps {
  status: BugStatus;
}

const BugStatusBadge = ({ status }: BugStatusBadgeProps) => {
  const getStyles = () => {
    switch (status) {
      case "new":
        return "bg-bug-new text-white";
      case "in-progress":
        return "bg-bug-inProgress text-white";
      case "resolved":
        return "bg-bug-resolved text-white";
      case "closed":
        return "bg-bug-closed text-white";
      default:
        return "";
    }
  };

  const getLabel = () => {
    switch (status) {
      case "new":
        return "New";
      case "in-progress":
        return "In Progress";
      case "resolved":
        return "Resolved";
      case "closed":
        return "Closed";
      default:
        return "";
    }
  };

  return (
    <Badge className={cn("font-medium", getStyles())}>{getLabel()}</Badge>
  );
};

export default BugStatusBadge;
