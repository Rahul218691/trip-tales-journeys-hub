
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface ImageViewerProps {
  images: string[];
  initialIndex?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ImageViewer = ({ images, initialIndex = 0, open, onOpenChange }: ImageViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-transparent">
        <div className="relative flex items-center justify-center w-full h-full">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Fullscreen image ${currentIndex + 1}`}
            className="max-w-full max-h-[90vh] object-contain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          
          <button 
            className="absolute top-2 right-2 p-2 rounded-full bg-background/80 text-foreground hover:bg-background/90 transition-colors z-10"
            onClick={() => onOpenChange(false)}
          >
            <X size={24} />
          </button>
          
          {images.length > 1 && (
            <>
              <button 
                className="absolute left-4 p-4 rounded-full bg-background/80 text-foreground hover:bg-background/90 transition-colors hidden md:block"
                onClick={handlePrev}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              
              <button 
                className="absolute right-4 p-4 rounded-full bg-background/80 text-foreground hover:bg-background/90 transition-colors hidden md:block"
                onClick={handleNext}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex ? "bg-primary w-4" : "bg-background/70"
                    }`}
                    onClick={() => setCurrentIndex(index)}
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
