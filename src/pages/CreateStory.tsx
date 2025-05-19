
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ImageIcon, MapPin, Send, Video } from "lucide-react";

const CreateStory = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  const handleImageUpload = () => {
    // This would usually be a real file upload
    setIsUploading(true);
    setTimeout(() => {
      setImages([
        ...images,
        "https://images.unsplash.com/photo-" + Math.floor(Math.random() * 1000000000) + "?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      ]);
      setIsUploading(false);
    }, 1500);
  };

  const handleVideoUpload = () => {
    // This would usually be a real video file upload
    setIsUploadingVideo(true);
    setTimeout(() => {
      setVideos([
        ...videos,
        // Sample video URL from a free stock video site
        "https://joy1.videvo.net/videvo_files/video/free/video0467/large_watermarked/_import_60e0267b4c3a96.16473365_preview.mp4"
      ]);
      setIsUploadingVideo(false);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !location || !content || (images.length === 0 && videos.length === 0)) {
      toast.error("Please fill in all fields and add at least one image or video");
      return;
    }
    
    // Here we would normally send the data to an API
    toast.success("Your story has been published!");
    navigate("/");
  };

  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Share Your Travel Story</h1>
      <p className="text-muted-foreground mb-8">
        Inspire others with your travel experiences and memories.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Give your story a catchy title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                id="location"
                placeholder="Where did this adventure take place?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <Label>Photos</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={`img-${index}`} className="aspect-[4/3] relative rounded-md overflow-hidden">
                <img src={image} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={handleImageUpload}
              className="aspect-[4/3] border-dashed flex flex-col items-center justify-center gap-2"
              disabled={isUploading}
            >
              <ImageIcon size={24} />
              <span>{isUploading ? "Uploading..." : "Add Photo"}</span>
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <Label>Videos</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((video, index) => (
              <div key={`vid-${index}`} className="aspect-video relative rounded-md overflow-hidden">
                <video 
                  src={video} 
                  className="w-full h-full object-cover" 
                  controls 
                  muted 
                />
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={handleVideoUpload}
              className="aspect-video border-dashed flex flex-col items-center justify-center gap-2"
              disabled={isUploadingVideo}
            >
              <Video size={24} />
              <span>{isUploadingVideo ? "Uploading..." : "Add Video"}</span>
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <Label htmlFor="content">Story</Label>
          <Textarea
            id="content"
            placeholder="Share the details of your journey..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px]"
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" className="gap-2">
            <Send size={16} />
            Publish Story
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateStory;
