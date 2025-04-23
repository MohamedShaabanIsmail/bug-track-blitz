import React, { createContext, useContext, useState } from "react";
import { Bug, BugSeverity, BugStatus, Comment, User } from "@/types";
import { bugs as initialBugs } from "@/data/mockData";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

interface BugContextProps {
  bugs: Bug[];
  addBug: (
    title: string,
    description: string,
    severity: BugSeverity,
    reportedBy: User
  ) => void;
  updateBugStatus: (bugId: string, status: BugStatus) => void;
  assignBug: (bugId: string, assignedTo: User) => void;
  addComment: (bugId: string, text: string, user: User) => void;
  getBugById: (id: string) => Bug | undefined;
}

const BugContext = createContext<BugContextProps | undefined>(undefined);

export const BugProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [bugs, setBugs] = useState<Bug[]>(initialBugs);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  const addBug = (
    title: string,
    description: string,
    severity: BugSeverity,
    reportedBy: User
  ) => {
    const newBug: Bug = {
      id: `bug-${bugs.length + 1}`,
      title,
      description,
      severity,
      status: "new",
      reportedBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
    };

    setBugs((prevBugs) => [...prevBugs, newBug]);
    toast({
      title: "Bug Created",
      description: "New bug has been successfully created",
    });
  };

  const updateBugStatus = (bugId: string, status: BugStatus) => {
    if (
      status === "closed" &&
      (!currentUser || !["manager", "tester"].includes(currentUser.role))
    ) {
      toast({
        title: "Permission Denied",
        description: "Only managers or testers can close a bug.",
        variant: "destructive",
      });
      return;
    }

    setBugs((prevBugs) =>
      prevBugs.map((bug) =>
        bug.id === bugId
          ? { ...bug, status, updatedAt: new Date().toISOString() }
          : bug
      )
    );
    toast({
      title: "Status Updated",
      description: `Bug status changed to ${status}`,
    });
  };

  const assignBug = (bugId: string, assignedTo: User) => {
    setBugs((prevBugs) =>
      prevBugs.map((bug) =>
        bug.id === bugId
          ? { ...bug, assignedTo, updatedAt: new Date().toISOString() }
          : bug
      )
    );
    toast({
      title: "Bug Assigned",
      description: `Bug assigned to ${assignedTo.name}`,
    });
  };

  const addComment = (bugId: string, text: string, user: User) => {
    const newComment: Comment = {
      id: `comment-${bugId}-${Date.now()}`,
      text,
      userId: user.id,
      user,
      createdAt: new Date().toISOString(),
    };

    setBugs((prevBugs) =>
      prevBugs.map((bug) =>
        bug.id === bugId
          ? {
              ...bug,
              comments: [...bug.comments, newComment],
              updatedAt: new Date().toISOString(),
            }
          : bug
      )
    );
    toast({
      title: "Comment Added",
      description: "Your comment has been added to the bug",
    });
  };

  const getBugById = (id: string) => {
    return bugs.find((bug) => bug.id === id);
  };

  return (
    <BugContext.Provider
      value={{
        bugs,
        addBug,
        updateBugStatus,
        assignBug,
        addComment,
        getBugById,
      }}
    >
      {children}
    </BugContext.Provider>
  );
};

export const useBug = () => {
  const context = useContext(BugContext);
  if (context === undefined) {
    throw new Error("useBug must be used within a BugProvider");
  }
  return context;
};
