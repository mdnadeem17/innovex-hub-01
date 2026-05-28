import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import EngineeringBackground from "@/components/EngineeringBackground";
import CinematicIntro from "@/components/CinematicIntro";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import ProjectMemories from "./pages/ProjectMemories";
import About from "./pages/About";
import FutureGoals from "./pages/FutureGoals";
import AddProject from "./pages/AddProject";
import AdminPanel from "./pages/AdminPanel";
import MemberPanel from "./pages/MemberPanel";
import BecomeMember from "./pages/BecomeMember";
import Achievements from "./pages/Achievements";
import AchievementDetail from "./pages/AchievementDetail";
import AchievementMemories from "./pages/AchievementMemories";
import AddAchievement from "./pages/AddAchievement";
import Participations from "./pages/Participations";
import ParticipationDetail from "./pages/ParticipationDetail";
import ParticipationMemories from "./pages/ParticipationMemories";
import AddParticipation from "./pages/AddParticipation";
import NotFound from "./pages/NotFound";
import Footer from "@/components/Footer";

import { useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [introComplete, setIntroComplete] = useState(() => {
    // Only show intro on homepage
    return window.location.pathname !== '/';
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          {!introComplete && <CinematicIntro onComplete={() => setIntroComplete(true)} />}
          <BrowserRouter>
            <div className="flex flex-col min-h-[100dvh]">
              <EngineeringBackground />
              <Header />
              <main className="relative z-10 flex-grow pt-24 md:pt-28"> {/* Added pt to account for fixed header */}
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:id" element={<ProjectDetail />} />
                  <Route path="/projects/:id/memories" element={<ProjectMemories />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/future-goals" element={<FutureGoals />} />
                  <Route path="/add-project" element={<AddProject />} />
                  <Route path="/achievements" element={<Achievements />} />
                  <Route path="/achievements/:id" element={<AchievementDetail />} />
                  <Route path="/achievements/:id/memories" element={<AchievementMemories />} />
                  <Route path="/add-achievement" element={<AddAchievement />} />
                  <Route path="/participations" element={<Participations />} />
                  <Route path="/participations/:id" element={<ParticipationDetail />} />
                  <Route path="/participations/:id/memories" element={<ParticipationMemories />} />
                  <Route path="/add-participation" element={<AddParticipation />} />
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="/member" element={<MemberPanel />} />
                  <Route path="/become-member" element={<BecomeMember />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider >
  );
};

export default App;
