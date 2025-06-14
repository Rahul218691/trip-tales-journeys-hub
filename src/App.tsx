import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Routes, Route, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { lazy, Suspense, useEffect, useContext, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import useLoadingWithRefresh from "@/hooks/useLoadingWithRefresh";
import { AuthContext } from "@/context/AuthContext";
import { StoryAlert } from "@/components/ui/StoryAlert";

import GuestRoute from "./routes/GuestRoute";
import PrivateRoute from "./routes/PrivateRoute";
import { LOCALSTORAGE_KEYS } from "./lib/constants";
import { pusher } from './lib/utils'

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

const App = () => {
  const queryClient = new QueryClient();
  const location = useLocation();
  const { loading } = useLoadingWithRefresh();

  const { state: { user } } = useContext(AuthContext);

  const [alertData, setAlertData] = useState<{ show: boolean; storyId: string; message: string }>({
    show: false,
    storyId: '',
    message: ''
  });

  useEffect(() => {
    if (user) {
      const channel = pusher.subscribe(`trip_tales_mystory_${user._id}`);

      channel.bind('story_creation', function(data: any) {
        console.log('Received story_creation event:', data);
        
        const storyId = data?.message?.storyId;

        if (storyId) {
          setAlertData({
            show: true,
            storyId,
            message: data.message.text
          });
        }
      });

      return () => {
        pusher.unsubscribe(`trip_tales_mystory_${user._id}`);
      };
    }
  }, [user]);

  useEffect(() => {
    return () => {
      const currentLocation = location.pathname;
      if (currentLocation !== '/login') {
        sessionStorage.setItem(LOCALSTORAGE_KEYS.PREVIOUS_LOCATION, currentLocation);
      }
    };
  }, [location]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <div className="flex flex-col min-h-screen">
            <Suspense fallback={<div className="h-16 bg-background" />}>
              <NavbarComponent />
            </Suspense>
            <StoryAlert 
              show={alertData.show}
              message={alertData.message}
              storyId={alertData.storyId}
              onClose={() => setAlertData(prev => ({ ...prev, show: false }))}
            />
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
                  <Route path="/create" element={<PrivateRoute><CreateStory /></PrivateRoute>} />
                  <Route path="/create-trip" element={<PrivateRoute><CreateTrip /></PrivateRoute>} />
                  <Route path="/profile/:id" element={<Profile />} />
                  <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
                  <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
          </div>
        </TooltipProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
