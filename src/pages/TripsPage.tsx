
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TripCard from "@/components/TripCard";
import { Calendar, MapPin, Plus, Search } from "lucide-react";

// Sample trip data
const upcomingTrips = [
  {
    id: "1",
    title: "Explore Tokyo",
    destination: "Tokyo, Japan",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    startDate: "June 10, 2025",
    endDate: "June 17, 2025",
    participants: 3,
    maxParticipants: 5,
  },
  {
    id: "2",
    title: "Safari Adventure",
    destination: "Serengeti, Tanzania",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    startDate: "July 5, 2025",
    endDate: "July 15, 2025",
    participants: 4,
    maxParticipants: 4,
  },
  {
    id: "3",
    title: "Road Trip West Coast",
    destination: "California, USA",
    image: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    startDate: "August 1, 2025",
    endDate: "August 10, 2025",
    participants: 2,
    maxParticipants: 6,
  }
];

const popularTrips = [
  {
    id: "4",
    title: "Greek Island Hopping",
    destination: "Greece",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    startDate: "September 5, 2025",
    endDate: "September 18, 2025",
    participants: 10,
    maxParticipants: 12,
  },
  {
    id: "5",
    title: "Northern Lights Adventure",
    destination: "Iceland",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    startDate: "November 15, 2025",
    endDate: "November 22, 2025",
    participants: 6,
    maxParticipants: 8,
  },
  {
    id: "6",
    title: "Inca Trail Expedition",
    destination: "Peru",
    image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    startDate: "October 3, 2025",
    endDate: "October 13, 2025",
    participants: 8,
    maxParticipants: 8,
  }
];

const TripsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="container py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Upcoming Trips</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Join fellow adventurers on their upcoming journeys or create your own trip and find travel companions.
        </p>
      </header>

      <div className="flex justify-between items-center gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Link to="/create-trip">
          <Button className="gap-2">
            <Plus size={16} />
            Create Trip
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="upcoming" className="w-full mb-16">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingTrips.map(trip => (
              <TripCard key={trip.id} {...trip} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="popular" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTrips.map(trip => (
              <TripCard key={trip.id} {...trip} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <section className="bg-gradient-to-r from-ocean/20 to-sunset/20 rounded-2xl p-8 md:p-12">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-3">Have an adventure planned?</h2>
            <p className="text-muted-foreground mb-6">
              Create your own trip and find fellow travelers to join you on your journey.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/create-trip">
                <Button>Create a Trip</Button>
              </Link>
              <Button variant="outline">Learn More</Button>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md rotate-3">
              <Calendar size={32} className="text-ocean mb-2" />
              <div className="text-sm font-medium">Plan Dates</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md -rotate-2">
              <MapPin size={32} className="text-sunset mb-2" />
              <div className="text-sm font-medium">Add Locations</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TripsPage;
