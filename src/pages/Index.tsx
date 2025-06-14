import { useState, useCallback } from "react";
import { useQuery } from '@tanstack/react-query'
import { Link } from "react-router-dom";
import StoryCard from "@/components/StoryCard";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import FilterModal from "@/components/FilterModal";
import Pagination from "@/components/Pagination";
import { DEFAULT_LIST_SIZE } from '@/lib/constants'
import { getStories } from "@/services/story";
import StoriesSkeleton from "@/components/StoriesSkeleton";
import useDebounce from "@/hooks/useDebounce";

const Index = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [sortBy, setSortBy] = useState<"mostRecent" | "mostPopular" | "mostCommented">("mostRecent");
  const [selectedTripTypes, setSelectedTripTypes] = useState<string[]>([]);
  const [transportationType, setTransportationType] = useState("");

  const handleFetchStories = useCallback(async(currentPage: number) => {
    try {
      const payload = {
        page: currentPage,
        limit: DEFAULT_LIST_SIZE,
        search: debouncedSearchQuery,
        sortBy,
        tripType: selectedTripTypes,
        transportation: transportationType
      }
      return await getStories(payload)
    } catch (error) {
      console.error("Error fetching stories:", error);
      throw error;
    }
  }, [debouncedSearchQuery, sortBy, selectedTripTypes, transportationType])

  const handleResetFilters = () => {
    setSearchQuery("");
    setSortBy("mostRecent");
    setSelectedTripTypes([]);
    setTransportationType("");
  };

  const handleApplyFilters = () => {
    setIsFilterModalOpen(false);
  };

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ['stories_list', currentPage, debouncedSearchQuery, sortBy, selectedTripTypes, transportationType],
    queryFn: () => handleFetchStories(currentPage),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 3 * 60 * 1000
  })
  
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

        {isLoading ? (
          <StoriesSkeleton />
        ) : data?.items?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-24 h-24 mb-6 text-muted-foreground/20">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No Stories Found</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              There are no travel stories to display at the moment. Be the first to share your journey!
            </p>
            <Link to="/create">
              <Button size="lg" className="rounded-full">
                Share Your Story
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.items?.map(story => (
              <StoryCard
                key={story._id}
                id={story._id}
                title={story.title}
                location={story.location}
                hasSaved={story.hasSaved}
                image={story.coverImage?.secureUrl || story.coverImage?.url || ''}
                author={{
                  name: story.createdBy?.username || '',
                  avatar: story.createdBy?.profileImgSecureUrl || story.createdBy?.profileImg || '',
                  id: story.createdBy?._id || ''
                }}
                likes={story.likes}
                comments={story.totalComments}
              />
            ))}
          </div>
        )}
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            hasNextPage={data?.hasNextPage}
            hasPrevPage={data?.hasPrevPage}
          />
        </div>
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
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        selectedTripTypes={selectedTripTypes}
        setSelectedTripTypes={setSelectedTripTypes}
        transportationType={transportationType}
        setTransportationType={setTransportationType}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};

export default Index;
