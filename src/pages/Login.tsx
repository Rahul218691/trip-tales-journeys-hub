import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { AuthContext } from "@/context/AuthContext";
import { login as authLogin } from "@/services/auth";
import { SET_USER_INFO } from "@/lib/constants";
import { Spinner } from "@/components/ui/spinner";

const Login = () => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const googleLoginRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse: { credential: string }) => {
    setIsLoading(true);
    try {
      const loginResponse = await authLogin({ token: credentialResponse.credential });
      dispatch({
        type: SET_USER_INFO,
        payload: loginResponse
      });
      toast.success("Successfully logged in!");
      navigate("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Spinner size="lg" />
            <p className="text-muted-foreground animate-pulse">Signing you in...</p>
          </div>
        </div>
      )}
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

            <div className="w-full flex justify-center google-btn-container" ref={googleLoginRef}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Login failed")}
                theme="filled_black"
                shape="rectangular"
                text="signin_with"
                locale="en"
                type="standard"
                context="signin"
                ux_mode="popup"
                auto_select={false}
                itp_support={true}
              />
            </div>

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
