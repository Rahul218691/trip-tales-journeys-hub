import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Settings } from "lucide-react";
import ProfileUpdateModal from "@/components/ProfileUpdateModal";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile, UpdateProfileData } from "@/services/user";
import { Skeleton } from "@/components/ui/skeleton";
import StoriesTab from "@/components/profile/StoriesTab";
import TripsTab from "@/components/profile/TripsTab";
import SavedTab from "@/components/profile/SavedTab";


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
                  <p className="text-2xl font-semibold">{data?.totalTrips}</p>
                  <p className="text-sm text-muted-foreground">Trips</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold">{data?.totalStories}</p>
                  <p className="text-sm text-muted-foreground">Stories</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold">{data?.followers}</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold">{data?.following}</p>
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
        {isUpdateModalOpen && data && (
          <ProfileUpdateModal
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            currentUser={{
              username: data?.username,
              email: data.email,
              bio: data?.bio,
              avatar: data?.profileImg,
            }}
            isUpdating={updateProfileMutation.isPending}
            onUpdate={handleProfileUpdate}
          />
        )}
        
        {/* Tabs */}
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
            <StoriesTab userId={id} />
          </TabsContent>
          
          <TabsContent value="trips" className="mt-0">
            <TripsTab trips={userTrips} />
          </TabsContent>
          
          <TabsContent value="saved" className="mt-0">
            <SavedTab userId={id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
