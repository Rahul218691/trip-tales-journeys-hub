
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Calendar, ImageIcon, MapPin, Send, Users } from "lucide-react";

const CreateTrip = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(4);
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = () => {
    // This would usually be a real file upload
    setIsUploading(true);
    setTimeout(() => {
      setCoverImage("https://images.unsplash.com/photo-" + Math.floor(Math.random() * 1000000000) + "?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80");
      setIsUploading(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !destination || !startDate || !endDate || !description || !coverImage) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // Here we would normally send the data to an API
    toast.success("Your trip has been created!");
    navigate("/trips");
  };

  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Create a Trip</h1>
      <p className="text-muted-foreground mb-8">
        Find travel companions for your next adventure.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Trip Title</Label>
            <Input
              id="title"
              placeholder="Give your trip a descriptive name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="destination">Destination</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                id="destination"
                placeholder="Where are you planning to go?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Label htmlFor="startDate">Start Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <Label htmlFor="endDate">End Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label htmlFor="maxParticipants">Maximum Participants</Label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              id="maxParticipants"
              type="number"
              min="2"
              max="20"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
              className="pl-10"
            />
          </div>
          <p className="text-sm text-muted-foreground">Including yourself</p>
        </div>

        <Separator />

        <div className="space-y-4">
          <Label>Cover Image</Label>
          {!coverImage ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleImageUpload}
              className="w-full h-[200px] border-dashed flex flex-col items-center justify-center gap-2"
              disabled={isUploading}
            >
              <ImageIcon size={24} />
              <span>{isUploading ? "Uploading..." : "Upload Cover Image"}</span>
            </Button>
          ) : (
            <div className="relative rounded-md overflow-hidden h-[200px]">
              <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm"
                onClick={handleImageUpload}
              >
                Change Image
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Label htmlFor="description">Trip Description</Label>
          <Textarea
            id="description"
            placeholder="Describe your trip plans, activities, and what kind of travelers you're looking for..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[150px]"
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" className="gap-2">
            <Send size={16} />
            Create Trip
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateTrip;
