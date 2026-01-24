import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Onboarding
import LoginChoice from "./pages/onboarding/LoginChoice";
import KakaoCallback from "./pages/onboarding/KakaoCallback";
import ProfileSetup from "./pages/onboarding/ProfileSetup";

// Main app
import Discover from "./pages/Discover";
import Pending from "./pages/Pending";
import Rooms from "./pages/Rooms";
import Profile from "./pages/Profile";
import CreateRoom from "./pages/rooms/CreateRoom";

// Settings
import AccountSettings from "./pages/settings/AccountSettings";
import FriendList from "./pages/settings/FriendList";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Redirect root to onboarding */}
          <Route path="/" element={<Navigate to="/onboarding" replace />} />
          
          {/* Onboarding flow */}
          <Route path="/onboarding" element={<LoginChoice />} />
          <Route path="/onboarding/callback" element={<KakaoCallback />} />
          <Route path="/onboarding/profile" element={<ProfileSetup />} />
          
          {/* Main app */}
          <Route path="/discover" element={<Discover />} />
          <Route path="/pending" element={<Pending />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/create" element={<CreateRoom />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Settings */}
          <Route path="/settings/account" element={<AccountSettings />} />
          <Route path="/settings/friends" element={<FriendList />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
