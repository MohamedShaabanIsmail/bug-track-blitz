
import { BugSeverity } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BugSeverityBadgeProps {
  severity: BugSeverity;
}

const BugSeverityBadge = ({ severity }: BugSeverityBadgeProps) => {
  const getStyles = () => {
    switch (severity) {
      case "critical":
        return "bg-bug-critical text-white";
      case "high":
        return "bg-bug-high text-white";
      case "medium":
        return "bg-bug-medium text-white";
      case "low":
        return "bg-bug-low text-white";
      default:
        return "";
    }
  };

  const getLabel = () => {
    switch (severity) {
      case "critical":
        return "Critical";
      case "high":
        return "High";
      case "medium":
        return "Medium";
      case "low":
        return "Low";
      default:
        return "";
    }
  };

  return (
    <Badge className={cn("font-medium", getStyles())}>{getLabel()}</Badge>
  );
};

export default BugSeverityBadge;
