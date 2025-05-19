
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";

interface TripCardProps {
  id: string;
  title: string;
  destination: string;
  image: string;
  startDate: string;
  endDate: string;
  participants: number;
  maxParticipants: number;
}

const TripCard = ({
  id,
  title,
  destination,
  image,
  startDate,
  endDate,
  participants,
  maxParticipants,
}: TripCardProps) => {
  const isFull = participants >= maxParticipants;

  return (
    <Card className="overflow-hidden card-hover animate-fade-in">
      <div className="aspect-[3/2] relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full"
        />
        <div className="absolute top-3 right-3">
          <Badge variant={isFull ? "outline" : "default"} className={isFull ? "bg-white text-foreground" : ""}>
            {isFull ? "Full" : `${participants}/${maxParticipants} joined`}
          </Badge>
        </div>
      </div>
      <CardContent className="pt-4">
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="flex items-center gap-1 mt-1 text-muted-foreground">
          <MapPin size={14} />
          <span className="text-sm">{destination}</span>
        </div>
        <div className="flex items-center gap-1 mt-1 text-muted-foreground">
          <Calendar size={14} />
          <span className="text-sm">{startDate} - {endDate}</span>
        </div>
        <div className="flex items-center gap-1 mt-1 text-muted-foreground">
          <Users size={14} />
          <span className="text-sm">{participants} joined, {maxParticipants - participants} spots left</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/trip/${id}`} className="w-full">
          <Button className={`w-full ${isFull ? "bg-muted text-muted-foreground hover:bg-muted" : ""}`} disabled={isFull}>
            {isFull ? "Trip Full" : "Join Trip"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default TripCard;
