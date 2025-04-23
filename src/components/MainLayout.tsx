
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

const MainLayout = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-[4.5rem] left-4 z-10"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        )}
        <div
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-200 ease-in-out absolute md:relative z-20 h-[calc(100%-4rem)] md:h-auto md:translate-x-0`}
        >
          <Sidebar />
        </div>
        <main className={`flex-1 overflow-auto p-6 ${isMobile && sidebarOpen ? "opacity-50" : ""}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
