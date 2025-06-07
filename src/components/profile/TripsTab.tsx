import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, MessageCircle } from "lucide-react";

interface Trip {
  id: string;
  title: string;
  location: string;
  date: string;
  image: string;
  participants: number;
}

interface TripsTabProps {
  trips: Trip[];
}

const TripsTab = ({ trips }: TripsTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {trips.map((trip) => (
        <Link to={`/trip/${trip.id}`} key={trip.id}>
          <Card className="overflow-hidden card-hover">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 aspect-square md:aspect-auto relative">
                <img 
                  src={trip.image} 
                  alt={trip.title} 
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-4 flex-1">
                <h3 className="font-semibold">{trip.title}</h3>
                <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                  <MapPin size={14} />
                  <span>{trip.location}</span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                  <Calendar size={14} />
                  <span>{trip.date}</span>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <div className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                    {trip.participants} travelers
                  </div>
                  <Button size="sm" variant="outline" className="ml-auto gap-1">
                    <MessageCircle size={14} />
                    <span>Join</span>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default TripsTab;