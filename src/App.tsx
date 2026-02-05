 import { Toaster } from "@/components/ui/toaster";
 import { Toaster as Sonner } from "@/components/ui/sonner";
 import { TooltipProvider } from "@/components/ui/tooltip";
 import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
 import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
 import Dashboard from "./pages/Dashboard";
 import ProjectDetail from "./pages/ProjectDetail";
 import ProjectOverview from "./pages/project/ProjectOverview";
 import ProjectActivity from "./pages/project/ProjectActivity";
 import ProjectFiles from "./pages/project/ProjectFiles";
 import ProjectTasks from "./pages/project/ProjectTasks";
 import ProjectBudget from "./pages/project/ProjectBudget";
 import ProjectGantt from "./pages/project/ProjectGantt";
 import Projects from "./pages/Projects";
 import Activity from "./pages/Activity";
 import Tasks from "./pages/Tasks";
 import Decisions from "./pages/Decisions";
 import Settings from "./pages/Settings";
 import NotFound from "./pages/NotFound";
 
 const queryClient = new QueryClient();
 
 const App = () => (
   <QueryClientProvider client={queryClient}>
     <TooltipProvider>
       <Toaster />
       <Sonner />
       <BrowserRouter>
         <Routes>
           <Route path="/" element={<Navigate to="/dashboard" replace />} />
           <Route path="/dashboard" element={<Dashboard />} />
           <Route path="/projects" element={<Projects />} />
           <Route path="/projects/:projectId" element={<ProjectDetail />}>
             <Route index element={<ProjectOverview />} />
             <Route path="activity" element={<ProjectActivity />} />
             <Route path="files" element={<ProjectFiles />} />
             <Route path="tasks" element={<ProjectTasks />} />
             <Route path="budget" element={<ProjectBudget />} />
             <Route path="gantt" element={<ProjectGantt />} />
           </Route>
           <Route path="/activity" element={<Activity />} />
           <Route path="/tasks" element={<Tasks />} />
           <Route path="/decisions" element={<Decisions />} />
           <Route path="/settings" element={<Settings />} />
           {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
           <Route path="*" element={<NotFound />} />
         </Routes>
       </BrowserRouter>
     </TooltipProvider>
   </QueryClientProvider>
 );
 
 export default App;
