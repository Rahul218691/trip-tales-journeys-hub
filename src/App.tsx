import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { lazy, Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

// Lazy load all route components
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const StoryDetail = lazy(() => import("./pages/StoryDetail"));
const TripsPage = lazy(() => import("./pages/TripsPage"));
const TripDetail = lazy(() => import("./pages/TripDetail"));
const CreateStory = lazy(() => import("./pages/CreateStory"));
const CreateTrip = lazy(() => import("./pages/CreateTrip"));
const Profile = lazy(() => import("./pages/Profile"));
const Login = lazy(() => import("./pages/Login"));
const Messages = lazy(() => import("./pages/Messages"));
const NavbarComponent = lazy(() => import("./components/Navbar"));

const queryClient = new QueryClient();

const App = () => (
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Suspense fallback={<div className="h-16 bg-background" />}>
              <NavbarComponent />
            </Suspense>
            <main className="flex-1">
              <Suspense fallback={
                <div className="min-h-[calc(100vh-4rem)] w-full flex items-center justify-center">
                  <Spinner size="lg" />
                </div>
              }>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/story/:id" element={<StoryDetail />} />
                  <Route path="/trips" element={<TripsPage />} />
                  <Route path="/trip/:id" element={<TripDetail />} />
                  <Route path="/create" element={<CreateStory />} />
                  <Route path="/create-trip" element={<CreateTrip />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
);

export default App;
