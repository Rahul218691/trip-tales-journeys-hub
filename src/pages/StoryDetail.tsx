import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from "date-fns";
import { Heart, Share2, Eye, Star, Lightbulb, MapPin, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { getStoryDetails, updateStoryViewCount, likeUnlikeStory } from "@/services/story";
import { AuthContext } from "@/context/AuthContext";
import ImageViewer from "@/components/ImageViewer";
import StoryDetailSkeleton from "@/components/StoryDetailSkeleton";
import { pusher } from "@/lib/utils";
import { Story } from "@/types/story";
import CommentSection from "@/components/CommentSection";

const StoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state: { user } } = useContext(AuthContext);
  const [isLiked, setIsLiked] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch story details
  const { 
    data: story, 
    isLoading: isLoadingStory,
    isFetching: isFetchingStory,
    error: storyError 
  } = useQuery<Story>({
    queryKey: ['story', id],
    queryFn: () => getStoryDetails(id as string),
    enabled: !!id,
    refetchOnWindowFocus: false
  });

  const updateViewCountMutation = useMutation({
    mutationKey: ['update-story-view-count'],
    mutationFn: (storyId: string) => updateStoryViewCount(storyId)
  })

  useEffect(() => {
    if (id) {
      updateViewCountMutation.mutate(id);
    }
  }, [id]);

  useEffect(() => {
    if (story?.hasLiked !== undefined) {
      setIsLiked(story.hasLiked);
    }
  }, [story?.hasLiked]);

  useEffect(() => {
    if (!id) return;

    const channel = pusher.subscribe(`story-${id}`);
    
    channel.bind('new-comment', (data: any) => {
      toast({
        title: "New Comment",
        description: `${data.user.username} commented on this story`,
      });
    });

    return () => {
      pusher.unsubscribe(`story-${id}`);
    };
  }, [id, toast]);

  const likeUnlikeMutation = useMutation({
    mutationFn: (storyId: string) => likeUnlikeStory(storyId),
    onSuccess: () => {
      setIsLiked(!isLiked);
      queryClient.setQueryData(['story', id], (old: any) => ({
        ...old,
        likes: isLiked ? old.likes - 1 : old.likes + 1,
        hasLiked: !isLiked
      }));
    }
  });

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like stories",
        variant: "destructive"
      });
      return;
    }

    if (user && story.createdBy?._id === user._id) {
      toast({
        title: "You can't like your own story",
        description: "You can only like stories created by other users",
        variant: "destructive"
      });
      return;
    }

    try {
      await likeUnlikeMutation.mutateAsync(id as string);
    } catch (error) {
      console.error('Error liking story:', error);
      toast({
        title: "Error",
        description: "Failed to like the story",
        variant: "destructive"
      });
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: story?.title,
        text: story?.content,
        url: window.location.href,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowImageViewer(true);
  };

  if (isLoadingStory || isFetchingStory) {
    return <StoryDetailSkeleton />;
  }

  if (storyError) {
    return (
      <div className="container py-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Story</h2>
        <p className="text-muted-foreground mb-6">
          Failed to load story details
        </p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="container py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Story Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The story you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Story header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{story.title}</h1>
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-10 w-10">
            <AvatarImage src={story.createdBy?.profileImg} />
            <AvatarFallback>{story.createdBy?.username?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{story.createdBy?.username}</p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(story.createdAt), 'MMMM d, yyyy')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          <Badge variant="secondary">{story.location}</Badge>
          <span>•</span>
          <span>{story.storyReadTime} min read</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{story.views} views</span>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {story.coverImage && (
        <div className="mb-8 aspect-[16/9] w-full overflow-hidden rounded-lg">
          <img
            src={story.coverImage.secureUrl || story.coverImage.url}
            alt={story.title}
            className="w-full h-full object-contain bg-muted"
          />
        </div>
      )}

      {/* Story images */}
      {story.storyImages && story.storyImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {story.storyImages.map((image, index) => (
            <div 
              key={index}
              className="aspect-square rounded-lg overflow-hidden cursor-pointer"
              onClick={() => handleImageClick(image.secureUrl || image.url)}
            >
              <img
                src={image.secureUrl || image.url}
                alt={`Story image ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              />
            </div>
          ))}
        </div>
      )}

      {/* Story actions */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-2 ${isLiked ? 'text-red-500' : ''}`}
          onClick={handleLike}
        >
          <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
          <span>{story.likes}</span>
        </Button>
      
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={handleShare}
        >
          <Share2 className="h-5 w-5" />
          <span>Share</span>
        </Button>
      </div>

      {/* Story content */}
      <div className="prose prose-lg max-w-none mb-8" dangerouslySetInnerHTML={{ __html: story.content }} />
      
      {/* Highlights and Tips Section */}
      {(story.highlights?.length > 0 || story.tips?.length > 0) && (
        <div className="bg-muted/50 rounded-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Highlights */}
            {story.highlights?.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <h3>Highlights</h3>
                </div>
                <ul className="space-y-3">
                  {story.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tips */}
            {story.tips?.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <h3>Travel Tips</h3>
                </div>
                <ul className="space-y-3">
                  {story.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="flex-shrink-0 mt-0.5">
                        {tip.toLowerCase().includes('time') ? (
                          <Clock className="h-5 w-5 text-blue-500" />
                        ) : tip.toLowerCase().includes('cost') || tip.toLowerCase().includes('price') ? (
                          <DollarSign className="h-5 w-5 text-green-500" />
                        ) : (
                          <Lightbulb className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
      
      <Separator className="my-8" />

      {/* Comments section */}
      <CommentSection storyId={id as string} />

      {/* Image viewer modal */}
      {showImageViewer && selectedImage && (
        <ImageViewer
          mediaItems={[{ type: "image", src: selectedImage }]}
          initialIndex={0}
          open={showImageViewer}
          onOpenChange={setShowImageViewer}
        />
      )}
    </div>
  );
};

export default StoryDetail;
