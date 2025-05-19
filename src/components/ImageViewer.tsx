
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface MediaItem {
  type: "image" | "video";
  src: string;
}

interface ImageViewerProps {
  mediaItems: MediaItem[];
  initialIndex?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ImageViewer = ({ mediaItems, initialIndex = 0, open, onOpenChange }: ImageViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaItems.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + mediaItems.length) % mediaItems.length);
  };

  if (!mediaItems || mediaItems.length === 0) return null;

  const currentItem = mediaItems[currentIndex];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-transparent">
        <DialogTitle>
          <VisuallyHidden>Media Viewer</VisuallyHidden>
        </DialogTitle>
        <div className="relative flex items-center justify-center w-full h-full">
          {currentItem.type === "image" ? (
            <motion.img
              key={`img-${currentIndex}`}
              src={currentItem.src}
              alt={`Fullscreen media ${currentIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <motion.video
              key={`video-${currentIndex}`}
              src={currentItem.src}
              className="max-w-full max-h-[90vh] object-contain"
              controls
              autoPlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              Your browser does not support the video tag.
            </motion.video>
          )}
          
          <button 
            className="absolute top-2 right-2 p-2 rounded-full bg-background/80 text-foreground hover:bg-background/90 transition-colors z-10"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
          >
            <X size={24} />
          </button>
          
          {mediaItems.length > 1 && (
            <>
              <button 
                className="absolute left-4 p-4 rounded-full bg-background/80 text-foreground hover:bg-background/90 transition-colors hidden md:block"
                onClick={handlePrev}
                aria-label="Previous"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              
              <button 
                className="absolute right-4 p-4 rounded-full bg-background/80 text-foreground hover:bg-background/90 transition-colors hidden md:block"
                onClick={handleNext}
                aria-label="Next"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {mediaItems.map((item, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex ? "bg-primary w-4" : "bg-background/70"
                    }`}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Go to media ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewer;
