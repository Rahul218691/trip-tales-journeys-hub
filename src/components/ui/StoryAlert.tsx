import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { X } from "lucide-react";
import { Link } from 'react-router-dom'

interface StoryAlertProps {
  show: boolean;
  message: string;
  storyId: string;
  onClose: () => void;
}

export const StoryAlert = ({ show, message, storyId, onClose }: StoryAlertProps) => {
  if (!show) return null;

  return (
    <Alert className="fixed top-20 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md z-50 bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/30 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl animate-in slide-in-from-top-2 duration-300">
      <AlertTitle className="flex items-center justify-between text-base font-semibold text-primary">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse ring-2 ring-primary/20" />
          {message}
        </span>
        <button 
          onClick={onClose}
          className="hover:opacity-70 transition-all p-1.5 rounded-full hover:bg-primary/10 text-primary/70 hover:text-primary"
        >
          <X size={16} />
        </button>
      </AlertTitle>
      <AlertDescription className="flex items-center gap-2 mt-2 text-sm">
        <Link
          to={`/story/${storyId}`}
          className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 hover:underline cursor-pointer font-medium transition-colors bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full"
          onClick={onClose}
        >
          View story
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right">
            <path d="M5 12h14"/>
            <path d="m12 5 7 7-7 7"/>
          </svg>
        </Link>
      </AlertDescription>
    </Alert>
  );
}; 