
import { useParams } from "react-router-dom";
import { useBug } from "@/context/BugContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BugStatusBadge from "@/components/BugStatusBadge";
import BugSeverityBadge from "@/components/BugSeverityBadge";
import UserAvatar from "@/components/UserAvatar";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow, format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BugStatus, User } from "@/types";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { users } from "@/data/mockData";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Link } from "react-router-dom";

const BugDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getBugById, updateBugStatus, assignBug, addComment } = useBug();
  const { currentUser } = useAuth();
  const [commentText, setCommentText] = useState("");

  const bug = getBugById(id as string);

  if (!bug) {
    return <div>Bug not found</div>;
  }

  const canEditStatus =
    currentUser?.role === "manager" ||
    (currentUser?.role === "developer" && 
     bug.assignedTo && bug.assignedTo.id === currentUser.id);

  const canAssignBug = currentUser?.role === "manager";

  const handleStatusChange = (status: string) => {
    updateBugStatus(bug.id, status as BugStatus);
  };

  const handleAssigneeChange = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      assignBug(bug.id, user);
    }
  };

  const handleAddComment = () => {
    if (commentText.trim() && currentUser) {
      addComment(bug.id, commentText, currentUser);
      setCommentText("");
    }
  };

  const developers = users.filter((u) => u.role === "developer");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/bugs">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">{bug.title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <BugStatusBadge status={bug.status} />
          <BugSeverityBadge severity={bug.severity} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{bug.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Comments</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-6">
              {bug.comments.length === 0 ? (
                <p className="text-center text-muted-foreground py-6">
                  No comments yet
                </p>
              ) : (
                bug.comments
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .map((comment) => (
                    <div key={comment.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <UserAvatar user={comment.user} size="sm" />
                          <div>
                            <p className="text-sm font-medium">
                              {comment.user.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(comment.createdAt), {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm pl-10">{comment.text}</p>
                      <Separator className="mt-4" />
                    </div>
                  ))
              )}

              {currentUser && (
                <div className="space-y-4 pt-4">
                  <Textarea
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={3}
                  />
                  <Button
                    onClick={handleAddComment}
                    disabled={commentText.trim() === ""}
                  >
                    Add Comment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                {canEditStatus ? (
                  <Select
                    value={bug.status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <BugStatusBadge status={bug.status} />
                )}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Severity</span>
                <BugSeverityBadge severity={bug.severity} />
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Reported By</span>
                <div className="flex items-center gap-2">
                  <UserAvatar user={bug.reportedBy} size="sm" />
                  <span className="text-sm">{bug.reportedBy.name}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Assigned To</span>
                {canAssignBug ? (
                  <Select
                    value={bug.assignedTo?.id || ""}
                    onValueChange={handleAssigneeChange}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                      {developers.map((dev) => (
                        <SelectItem key={dev.id} value={dev.id}>
                          {dev.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-2">
                    {bug.assignedTo ? (
                      <>
                        <UserAvatar user={bug.assignedTo} size="sm" />
                        <span className="text-sm">{bug.assignedTo.name}</span>
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Unassigned
                      </span>
                    )}
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm">
                  {format(new Date(bug.createdAt), "MMM d, yyyy")}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <span className="text-sm">
                  {formatDistanceToNow(new Date(bug.updatedAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">
                  {format(new Date(bug.createdAt), "MMM d, yyyy")} -{" "}
                  <span className="font-medium text-foreground">
                    {bug.reportedBy.name}
                  </span>{" "}
                  created this issue
                </p>
                <p>
                  {format(new Date(bug.updatedAt), "MMM d, yyyy")} - Last updated
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BugDetail;
