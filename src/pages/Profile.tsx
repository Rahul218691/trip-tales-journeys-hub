import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, Edit, Settings, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import ProfileUpdateModal from "@/components/ProfileUpdateModal";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile, UpdateProfileData } from "@/services/user";
import { Skeleton } from "@/components/ui/skeleton";


const userStories = [
  {
    id: "1",
    title: "Amazing trek through the Himalayas",
    location: "Nepal",
    date: "July 15, 2023",
    image: "https://images.unsplash.com/photo-1486911278844-a81c5267e227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    likes: 156
  },
  {
    id: "2",
    title: "Weekend in Paris",
    location: "France",
    date: "May 22, 2023",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    likes: 98
  },
  {
    id: "3",
    title: "Road trip through California",
    location: "USA",
    date: "April 3, 2023",
    image: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    likes: 124
  }
];

const userTrips = [
  {
    id: "1",
    title: "Exploring Bangkok",
    location: "Thailand",
    date: "December 10-20, 2023",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c8dd0d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    participants: 4
  },
  {
    id: "2",
    title: "Surfing in Bali",
    location: "Indonesia",
    date: "January 5-15, 2024",
    image: "https://images.unsplash.com/photo-1484924331917-24b8c2f118f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    participants: 2
  }
];

const ProfileSkeleton = () => (
  <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
    <Skeleton className="w-32 h-32 rounded-full bg-gray-300" />
    <div className="flex-1 space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48 bg-gray-300" />
        <Skeleton className="h-4 w-32 bg-gray-300" />
      </div>
      <Skeleton className="h-4 w-full max-w-lg bg-gray-300" />
      <div className="flex flex-wrap gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-8 w-12 bg-gray-300" />
            <Skeleton className="h-4 w-16 bg-gray-300" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Profile = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("stories");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const handleFetchProfile = useCallback(async() => {
    try {
      return await getProfile(id)
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  }, [id])

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['profile', id],
    queryFn: handleFetchProfile,
    enabled: !!id,
    refetchOnWindowFocus: false
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileData) => updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', id] });
      toast.success("Profile updated successfully!");
      setIsUpdateModalOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error);
    }
  });

  const handleProfileUpdate = async (data: {
    username: string;
    email: string;
    bio: string;
    avatar?: File;
  }) => {
    const updateData: UpdateProfileData = {
      username: data.username,
      bio: data.bio,
      profile: data.avatar
    };
    updateProfileMutation.mutate(updateData);
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="space-y-8">
        {/* Profile Header */}
        {((isLoading || isFetching) && !data) ? (
          <ProfileSkeleton />
        ) : (
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-background">
                <AvatarImage src={data?.profileImg} alt={data?.username} />
                <AvatarFallback className="text-4xl">{data?.username.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h1 className="text-3xl font-bold">{data?.username}</h1>
              </div>
              
              <p className="max-w-lg">{data?.bio}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-6">
                <div className="text-center">
                  <p className="text-2xl font-semibold">0</p>
                  <p className="text-sm text-muted-foreground">Trips</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold">0</p>
                  <p className="text-sm text-muted-foreground">Stories</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold">0</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold">0</p>
                  <p className="text-sm text-muted-foreground">Following</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => setIsUpdateModalOpen(true)}
              >
                <Edit size={16} />
                <span>Edit</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Settings size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* Profile Update Modal */}
        {
          isUpdateModalOpen && data && <ProfileUpdateModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          currentUser={{
            username: data?.username,
            email: data.email, // TODO: Get from actual user data
            bio: data?.bio,
            avatar: data?.profileImg,
          }}
          isUpdating={updateProfileMutation.isPending}
          onUpdate={handleProfileUpdate}
        />
        }
        
        {/* Tabs for Stories and Trips */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start mb-6 border-b rounded-none h-auto p-0">
            <TabsTrigger 
              value="stories" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3"
            >
              Stories
            </TabsTrigger>
            <TabsTrigger 
              value="trips" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3"
            >
              Planned Trips
            </TabsTrigger>
            <TabsTrigger 
              value="saved" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3"
            >
              Saved
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="stories" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {userStories.map((story) => (
                <Link to={`/story/${story.id}`} key={story.id}>
                  <Card className="overflow-hidden card-hover">
                    <div className="aspect-[4/3] relative">
                      <img 
                        src={story.image} 
                        alt={story.title} 
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold line-clamp-1">{story.title}</h3>
                      <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                        <MapPin size={14} />
                        <span>{story.location}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar size={14} />
                          <span>{story.date}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {story.likes} likes
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="trips" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userTrips.map((trip) => (
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
          </TabsContent>
          
          <TabsContent value="saved" className="mt-0">
            <div className="text-center py-12">
              <p className="text-muted-foreground">No saved stories or trips yet.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
