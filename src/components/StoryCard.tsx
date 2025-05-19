
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle } from "lucide-react";

interface StoryCardProps {
  id: string;
  title: string;
  location: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
  likes: number;
  comments: number;
}

const StoryCard = ({
  id,
  title,
  location,
  image,
  author,
  likes,
  comments,
}: StoryCardProps) => {
  return (
    <Link to={`/story/${id}`}>
      <Card className="overflow-hidden card-hover animate-fade-in">
        <div className="aspect-[4/3] relative overflow-hidden">
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
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
