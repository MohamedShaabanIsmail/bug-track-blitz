
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { BugProvider } from "@/context/BugContext";
import MainLayout from "@/components/MainLayout";
import Dashboard from "@/pages/Dashboard";
import BugList from "@/pages/BugList";
import BugDetail from "@/pages/BugDetail";
import CreateBug from "@/pages/CreateBug";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BugProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/bugs" element={<BugList />} />
                <Route path="/bugs/:id" element={<BugDetail />} />
                <Route path="/create" element={<CreateBug />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </BugProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
