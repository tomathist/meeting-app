import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Onboarding
import LoginChoice from "./pages/onboarding/LoginChoice";
import PhoneVerification from "./pages/onboarding/PhoneVerification";
import ProfileSetup from "./pages/onboarding/ProfileSetup";
import ProfilePicture from "./pages/onboarding/ProfilePicture";
import BioSetup from "./pages/onboarding/BioSetup";
import EmailVerification from "./pages/onboarding/EmailVerification";

// Main app
import Discover from "./pages/Discover";
import Rooms from "./pages/Rooms";
import Chat from "./pages/Chat";
import Inbox from "./pages/Inbox";
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
          <Route path="/onboarding/phone" element={<PhoneVerification />} />
          <Route path="/onboarding/profile" element={<ProfileSetup />} />
          <Route path="/onboarding/picture" element={<ProfilePicture />} />
          <Route path="/onboarding/bio" element={<BioSetup />} />
          <Route path="/onboarding/email" element={<EmailVerification />} />
          
          {/* Main app */}
          <Route path="/discover" element={<Discover />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/create" element={<CreateRoom />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/inbox" element={<Inbox />} />
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
