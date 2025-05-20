import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useGoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        setIsLoading(true);
        // Here you would typically send the access token to your backend
        // const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        //   headers: { Authorization: `Bearer ${response.access_token}` },
        // }).then(res => res.json());
        console.log(response)
        toast.success("Successfully logged in!");
        navigate("/");
      } catch (error) {
        toast.error("Failed to login");
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      toast.error("Login failed");
      setIsLoading(false);
    }
  });

  const handleGoogleLogin = () => {
    setIsLoading(true);
    login();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-ocean to-sunset bg-clip-text text-transparent mb-2">
            Welcome to Trip Tales
          </h1>
          <p className="text-muted-foreground">
            Share your adventures, discover new places
          </p>
        </div>

        <div className="bg-card rounded-xl shadow-lg p-8 border">
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-semibold">Sign in</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Sign in to start sharing your journey
              </p>
            </div>

            <Button 
              className="w-full py-6 text-base flex items-center justify-center gap-3"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 0, 0)">
                  <path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1Z" fill="currentColor"></path>
                </g>
              </svg>
              {isLoading ? "Signing in..." : "Sign in with Google"}
            </Button>

            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>By signing in, you agree to our Terms and Privacy Policy</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
