import { useCallback, useContext, useState } from 'react'
import { Link } from "react-router-dom";
import { Card, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveUnsaveStory } from '@/services/story';

interface StoryCardProps {
  id: string;
  title: string;
  location: string;
  image: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  likes: number;
  comments: number;
  hasSaved: boolean;
}

const StoryCard = ({
  id,
  title,
  location,
  image,
  author,
  likes,
  comments,
  hasSaved
}: StoryCardProps) => {

  const { toast } = useToast();

  const { state: { user } } = useContext(AuthContext)

  const queryClient = useQueryClient()

  const [isSaved, setIsSaved] = useState(hasSaved)

  const addStoryToSaveOrRemoveMutate = useMutation({
    mutationFn: saveUnsaveStory,
    onMutate: () => {
      setIsSaved((prev) => !prev)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories_list'] });
    }
  })

  const handleSaveStory = useCallback((e: any) => {
    if (e) e.preventDefault()
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save stories",
        variant: "destructive"
      });
      return;
    }

    if (user && author.id === user._id) {
      toast({
        title: "You can't save your own story",
        description: "You can only save stories created by other users",
        variant: "destructive"
      });
      return;
    }

    try {
      addStoryToSaveOrRemoveMutate.mutate(id)
    } catch (error) {
      console.error('Error liking story:', error);
      toast({
        title: "Error",
        description: "Failed to save the story",
        variant: "destructive"
      });
    }
  }, [user])

  return (
    <Link to={`/story/${id}`}>
      <Card className="overflow-hidden card-hover animate-fade-in">
        <div className="aspect-[4/3] relative overflow-hidden group">
          <img
            src={image}
            alt={title}
            className="object-fill w-full h-full transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {
            user && user._id !== author.id && (
            <Button
              variant="ghost"
              size="icon"
              className={`absolute top-2 right-2 ${isSaved ? 'bg-orange-600/90 hover:bg-orange-600 text-white' : 'bg-background/80 hover:bg-background text-foreground hover:text-foreground'}`}
              onClick={handleSaveStory}
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? 'text-white' : ''}`} />
            </Button>
            )
          }
          <div className="absolute bottom-0 left-0 p-4 text-white">
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="text-sm text-white/80">{location}</p>
          </div>
        </div>
        <CardFooter className="flex justify-between py-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={author.avatar} />
              <AvatarFallback>{author.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{author.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{likes} likes</span>
            <div className="flex items-center gap-1">
              <MessageCircle size={14} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{comments}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default StoryCard;
