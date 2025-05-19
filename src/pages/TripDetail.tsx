
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MapPin, Send, Users } from "lucide-react";
import { toast } from "sonner";
import CommentSection from "@/components/CommentSection";

// Sample trip details
const trip = {
  id: "1",
  title: "Explore Tokyo",
  destination: "Tokyo, Japan",
  image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  startDate: "June 10, 2025",
  endDate: "June 17, 2025",
  participants: [
    {
      id: "u1",
      name: "Alex Morgan",
      avatar: "",
      role: "organizer"
    },
    {
      id: "u2",
      name: "Jamie Lee",
      avatar: "",
    },
    {
      id: "u3",
      name: "Taylor Kim",
      avatar: "",
    }
  ],
  maxParticipants: 5,
  description: `
    <p>Join me for an incredible week exploring Tokyo! We'll discover both the traditional and ultramodern sides of Japan's fascinating capital.</p>
    
    <p><strong>Tentative Itinerary:</strong></p>
    <ul>
      <li>Day 1-2: Explore central Tokyo - Shibuya, Shinjuku, and Harajuku</li>
      <li>Day 3: Visit historic temples and gardens</li>
      <li>Day 4: Day trip to Mount Fuji</li>
      <li>Day 5-6: Discover Tokyo's food scene and nightlife</li>
      <li>Day 7: Shopping and relaxation</li>
    </ul>
    
    <p>Accommodations will be at a mid-range hotel in Shinjuku, conveniently located near the station.</p>
    
    <p>Looking for fellow travelers who are curious, respectful, and excited to immerse themselves in Japanese culture. Some knowledge of basic Japanese phrases would be helpful but not required.</p>
    
    <p>Expected budget: $1,500-$2,000 excluding flights.</p>
  `,
  comments: [
    {
      id: "c1",
      author: {
        name: "Sophia Chen",
        avatar: "",
      },
      content: "This sounds amazing! I've always wanted to visit Tokyo. Are you planning to see any specific neighborhoods?",
      timestamp: "3 days ago",
    },
    {
      id: "c2",
      author: {
        name: "Mike Davis",
        avatar: "",
      },
      content: "I lived in Tokyo for a year and can recommend some great local spots if you're interested.",
      timestamp: "1 day ago",
    }
  ]
};

const TripDetail = () => {
  const { id } = useParams();
  const [requestMessage, setRequestMessage] = useState("");
  const [hasRequested, setHasRequested] = useState(false);
  
  const remainingSpots = trip.maxParticipants - trip.participants.length;
  const isFull = remainingSpots <= 0;

  const handleJoinRequest = () => {
    if (!requestMessage.trim()) {
      toast.error("Please enter a message to the organizer");
      return;
    }
    
    // Here we would normally send the request to an API
    toast.success("Your join request has been sent!");
    setHasRequested(true);
  };

  return (
    <div className="container py-8">
      <div className="max-w-5xl mx-auto">
        <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-8">
          <img 
            src={trip.image} 
            alt={trip.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h1 className="text-4xl font-bold mb-2">{trip.title}</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <span>{trip.destination}</span>
              </div>
              <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{trip.startDate} - {trip.endDate}</span>
              </div>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <Badge variant={isFull ? "outline" : "default"} className="text-sm px-3 py-1">
              {isFull ? "Trip Full" : `${remainingSpots} spots left`}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">About This Trip</h2>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: trip.description }}
              />
            </section>

            <Separator className="my-8" />

            <CommentSection comments={trip.comments} />
          </div>

          <div className="md:w-1/3 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Travelers ({trip.participants.length}/{trip.maxParticipants})</h3>
                <div className="space-y-4">
                  {trip.participants.map(participant => (
                    <div key={participant.id} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback>{participant.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{participant.name}</div>
                        {participant.role === "organizer" && (
                          <div className="text-xs text-muted-foreground">Organizer</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Join This Trip</h3>
                {hasRequested ? (
                  <div className="text-center py-4">
                    <div className="text-primary text-lg mb-2">Request Sent!</div>
                    <p className="text-sm text-muted-foreground">
                      The trip organizer will review your request and get back to you soon.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Send a message to the organizer explaining why you'd like to join this trip.
                    </p>
                    <Textarea
                      placeholder="Introduce yourself and share why you're interested..."
                      value={requestMessage}
                      onChange={(e) => setRequestMessage(e.target.value)}
                      className="resize-none"
                      rows={4}
                      disabled={isFull}
                    />
                    <Button 
                      onClick={handleJoinRequest} 
                      className="w-full gap-2"
                      disabled={!requestMessage.trim() || isFull}
                    >
                      <Send size={16} />
                      {isFull ? "Trip Is Full" : "Send Join Request"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetail;
