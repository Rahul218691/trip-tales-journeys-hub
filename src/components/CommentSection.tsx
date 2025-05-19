
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
}

interface CommentSectionProps {
  comments: Comment[];
}

const CommentSection = ({ comments: initialComments }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (newComment.trim() === "") return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: {
        name: "Current User",
        avatar: "",
      },
      content: newComment,
      timestamp: "Just now",
    };

    setComments([comment, ...comments]);
    setNewComment("");
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Comments ({comments.length})</h3>
      
      <div className="flex gap-3">
        <Avatar>
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="resize-none"
          />
          <div className="flex justify-end mt-2">
            <Button onClick={handleAddComment} disabled={!newComment.trim()} size="sm" className="gap-2">
              <Send size={16} />
              Post
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar>
              <AvatarImage src={comment.author.avatar} />
              <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{comment.author.name}</h4>
                <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
              </div>
              <p className="mt-1 text-sm">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
