import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StoryCard from "@/components/StoryCard";
import { Button } from "@/components/ui/button";
import { Filter, ArrowRight } from "lucide-react";
import FilterModal from "@/components/FilterModal";
import Pagination from "@/components/Pagination";

// Sample data for stories
const popularStories = [
  {
    id: "1",
    title: "Island Paradise",
    location: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    author: {
      name: "Julia Chen",
      avatar: "",
    },
    likes: 128,
    comments: 32,
  },
  {
    id: "2",
    title: "Mountain Escape",
    location: "Swiss Alps",
    image: "https://images.unsplash.com/photo-1458668383970-8ddd3927deed?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    author: {
      name: "Alex Morgan",
      avatar: "",
    },
    likes: 89,
    comments: 14,
  },
  {
    id: "3",
    title: "Desert Journey",
    location: "Morocco",
    image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    author: {
      name: "Sam Rodriguez",
      avatar: "",
    },
    likes: 65,
    comments: 8,
  }
];

const recentStories = [
  {
    id: "4",
    title: "Coastal Road Trip",
    location: "California, USA",
    image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    author: {
      name: "Taylor Swift",
      avatar: "",
    },
    likes: 42,
    comments: 7,
  },
  {
    id: "5",
    title: "Rural Countryside",
    location: "Tuscany, Italy",
    image: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    author: {
      name: "Marco Rossi",
      avatar: "",
    },
    likes: 35,
    comments: 5,
  },
  {
    id: "6",
    title: "Beach Getaway",
    location: "Maldives",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    author: {
      name: "Lila Kim",
      avatar: "",
    },
    likes: 29,
    comments: 4,
  }
];

const Index = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const storiesData = activeTab === "popular" ? popularStories : recentStories;
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1); // Reset to first page when changing tabs
  };
  
  return (
    <div className="container py-8">
      {/* Hero section */}
      <section className="mb-16 relative overflow-hidden rounded-2xl">
        <div className="relative w-full h-[500px]">
          <img 
            src="https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80" 
            alt="Travel experiences" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center p-8 sm:p-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white max-w-2xl animate-fade-in">
              Share Your Journey, Inspire Others
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-white/90 max-w-xl animate-fade-in" style={{animationDelay: "0.2s"}}>
              Document your adventures, discover new destinations, and connect with fellow travelers.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 animate-fade-in" style={{animationDelay: "0.4s"}}>
              <Link to="/create">
                <Button size="lg" className="rounded-full">
                  Share Your Story
                </Button>
              </Link>
              <Link to="/trips">
                <Button size="lg" variant="outline" className="rounded-full bg-white/10 hover:bg-white/20 border-white/30 text-white">
                  Browse Trips
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stories section */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Travel Stories</h2>
          <Button 
            variant="ghost" 
            onClick={() => setIsFilterModalOpen(true)} 
            className="text-primary flex items-center gap-1"
          >
            Filter <Filter size={16} />
          </Button>
        </div>

        <Tabs defaultValue="popular" className="w-full" onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>
          <TabsContent value="popular" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularStories.map(story => (
                <StoryCard key={story.id} {...story} />
              ))}
            </div>
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                hasNextPage={false}
                hasPrevPage={false}
              />
            </div>
          </TabsContent>
          <TabsContent value="recent" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentStories.map(story => (
                <StoryCard key={story.id} {...story} />
              ))}
            </div>
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                hasNextPage={false}
                hasPrevPage={false}
              />
            </div>
          </TabsContent>
        </Tabs>
      </section>
      
      {/* CTA section */}
      <section className="bg-ocean/10 rounded-2xl p-8 text-center mb-16">
        <h2 className="text-2xl font-bold mb-4">Planning your next adventure?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          Create a trip and invite other travelers to join you on your next journey.
        </p>
        <Link to="/create-trip">
          <Button>Create a Trip</Button>
        </Link>
      </section>
      
      {/* Filter modal */}
      <FilterModal 
        isOpen={isFilterModalOpen} 
        onClose={() => setIsFilterModalOpen(false)} 
      />
    </div>
  );
};

export default Index;
