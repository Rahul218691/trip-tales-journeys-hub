import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ImageIcon, MapPin, Send, Video, Plus, X, Star, Lightbulb } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useMutation } from "@tanstack/react-query";
import { createStory } from "@/services/story";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TRANSPORTATION_TYPES, TRIP_TYPES } from "@/lib/constants";


const CreateStory = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [locationMapUrl, setLocationMapUrl] = useState("");
  const [budget, setBudget] = useState("");
  const [date, setDate] = useState<Date>();
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [tripType, setTripType] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [coverImage, setCoverImage] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [previewVideos, setPreviewVideos] = useState<string[]>([]);
  const [previewCover, setPreviewCover] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [tips, setTips] = useState<string[]>([]);
  const [newHighlight, setNewHighlight] = useState("");
  const [newTip, setNewTip] = useState("");
  const [transportation, setTransportation] = useState("")
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const storyImageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const createStoryMutation = useMutation({
    mutationFn: createStory,
    onSuccess: (message) => {
      toast.success(message);
      navigate("/");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create story");
    }
  });

  const handleCoverImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingCover(true);
      setCoverImage([file]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewCover(reader.result as string);
        setIsUploadingCover(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStoryImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setIsUploading(true);
      setImages(prev => [...prev, ...files]);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImages(prev => [...prev, reader.result as string]);
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingVideo(true);
      setVideos(prev => [...prev, file]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewVideos(prev => [...prev, reader.result as string]);
        setIsUploadingVideo(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddHighlight = () => {
    if (newHighlight.trim()) {
      setHighlights([...highlights, newHighlight.trim()]);
      setNewHighlight("");
    }
  };

  const handleRemoveHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const handleAddTip = () => {
    if (newTip.trim()) {
      setTips([...tips, newTip.trim()]);
      setNewTip("");
    }
  };

  const handleRemoveTip = (index: number) => {
    setTips(tips.filter((_, i) => i !== index));
  };

  const handleRemoveCoverImage = () => {
    setCoverImage([]);
    setPreviewCover("");
    if (coverImageInputRef.current) {
      coverImageInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviewImages(previewImages.filter((_, i) => i !== index));
    if (storyImageInputRef.current) {
      storyImageInputRef.current.value = "";
    }
  };

  const handleRemoveVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index));
    setPreviewVideos(previewVideos.filter((_, i) => i !== index));
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !location || !content || coverImage.length === 0 || (images.length === 0 && videos.length === 0)) {
      toast.error("Please fill in all required fields and add at least one image or video");
      return;
    }

    if (!date) {
      toast.error("Please select a travel date");
      return;
    }

    if (!tripType) {
      toast.error("Please select a trip type");
      return;
    }

    if (!transportation) {
      toast.error("Please select a transportation type");
      return;
    }
    
    const storyData = {
      title,
      location,
      locationMapUrl,
      budget,
      travelDate: date,
      tripType,
      isPublic,
      content,
      coverImage: coverImage[0],
      images,
      videos,
      highlights,
      tips,
      transportation
    };

    createStoryMutation.mutate(storyData);
  };

  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Share Your Travel Story</h1>
      <p className="text-muted-foreground mb-8">
        Inspire others with your travel experiences and memories.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Story Visibility */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-0.5">
            <Label>Story Visibility</Label>
            <p className="text-sm text-muted-foreground">
              {isPublic ? "This story will be visible to everyone" : "Only you can see this story"}
            </p>
          </div>
          <Switch
            checked={isPublic}
            onCheckedChange={setIsPublic}
          />
        </div>

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

          <div>
            <Label htmlFor="locationMapUrl">Google Maps URL (Optional)</Label>
            <Input
              id="locationMapUrl"
              placeholder="https://maps.google.com/..."
              value={locationMapUrl}
              onChange={(e) => setLocationMapUrl(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                placeholder="Enter your budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>

            <div>
              <Label>Travel Date</Label>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      setDate(newDate);
                      setDatePickerOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <Label htmlFor="tripType">Trip Type</Label>
            <Select value={tripType} onValueChange={setTripType}>
              <SelectTrigger>
                <SelectValue placeholder="Select trip type" />
              </SelectTrigger>
              <SelectContent>
                {TRIP_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="transportation">Transportation Type</Label>
            <Select value={transportation} onValueChange={setTransportation}>
              <SelectTrigger>
                <SelectValue placeholder="Select transportation type" />
              </SelectTrigger>
              <SelectContent>
                {TRANSPORTATION_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Cover Image */}
        <div className="space-y-4">
          <Label>Cover Image</Label>
          <div className="grid grid-cols-1 gap-4">
            {previewCover && (
              <div className="aspect-[16/9] relative rounded-md overflow-hidden">
                <img src={previewCover} alt="Cover" className="w-full h-full object-cover" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveCoverImage}
                >
                  <X size={16} />
                </Button>
              </div>
            )}
            
            <input
              type="file"
              ref={coverImageInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleCoverImageSelect}
            />
            {
              !previewCover && <Button
              type="button"
              variant="outline"
              onClick={() => coverImageInputRef.current?.click()}
              className="aspect-[16/9] border-dashed flex flex-col items-center justify-center gap-2"
              disabled={isUploadingCover}
            >
              <ImageIcon size={24} />
              <span>{isUploadingCover ? "Uploading..." : "Add Cover Image"}</span>
            </Button>
            }
          </div>
        </div>

        {/* Highlights */}
        <div className="space-y-4">
          <Label>Highlights</Label>
          <div className="space-y-4">
            {highlights.map((highlight, index) => (
              <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="flex-1">{highlight}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveHighlight(index)}
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Input
                placeholder="Add a highlight..."
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddHighlight())}
              />
              <Button type="button" onClick={handleAddHighlight}>
                <Plus size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="space-y-4">
          <Label>Tips</Label>
          <div className="space-y-4">
            {tips.map((tip, index) => (
              <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                <Lightbulb className="h-5 w-5 text-blue-500" />
                <span className="flex-1">{tip}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveTip(index)}
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Input
                placeholder="Add a tip..."
                value={newTip}
                onChange={(e) => setNewTip(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTip())}
              />
              <Button type="button" onClick={handleAddTip}>
                <Plus size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Photos */}
        <div className="space-y-4">
          <Label>Photos</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {previewImages.map((image, index) => (
              <div key={`img-${index}`} className="aspect-[4/3] relative rounded-md overflow-hidden">
                <img src={image} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => handleRemoveImage(index)}
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
            
            <input
              type="file"
              ref={storyImageInputRef}
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleStoryImageSelect}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => storyImageInputRef.current?.click()}
              className="aspect-[4/3] border-dashed flex flex-col items-center justify-center gap-2"
              disabled={isUploading}
            >
              <ImageIcon size={24} />
              <span>{isUploading ? "Uploading..." : "Add Photos"}</span>
            </Button>
          </div>
        </div>

        {/* Videos */}
        <div className="space-y-4">
          <Label>Videos</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {previewVideos.map((video, index) => (
              <div key={`vid-${index}`} className="aspect-video relative rounded-md overflow-hidden">
                <video 
                  src={video} 
                  className="w-full h-full object-cover" 
                  controls 
                  muted 
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => handleRemoveVideo(index)}
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
            
            <input
              type="file"
              ref={videoInputRef}
              className="hidden"
              accept="video/*"
              onChange={handleVideoSelect}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => videoInputRef.current?.click()}
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
