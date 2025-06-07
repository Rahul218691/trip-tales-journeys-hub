import { useState, useContext } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AuthContext } from "@/context/AuthContext";
import { Send, Loader2, Trash2 } from "lucide-react";
import { getStoryComments, addComment, deleteComment } from "@/services/story";
import { useToast } from "@/components/ui/use-toast";

interface CommentSectionProps {
  storyId: string;
}

const COMMENTS_PER_PAGE = 10;

const CommentSection = ({ storyId }: CommentSectionProps) => {
  const { state: { user } } = useContext(AuthContext)
  const queryClient = useQueryClient()
  const { toast } = useToast();

  const [newComment, setNewComment] = useState("");

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ["comments", storyId],
    queryFn: ({ pageParam = 1 }) => getStoryComments({ 
      storyId, 
      page: pageParam, 
      limit: COMMENTS_PER_PAGE 
    }),
    getNextPageParam: (lastPage, allPages) => 
      lastPage.hasNextPage ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    refetchOnWindowFocus: true
  });

  const comments = data?.pages.flatMap(page => page.items) || [];

  const addCommentToStoryMutation = useMutation({
    mutationFn: addComment,
    onSuccess: (response) => {
      const data = {
        ...response,
        createdBy: {
          _id: user._id,
          username: user.username,
          profileImg: user.profileImg,
          profileImgSecureUrl: user.profileImgSecureUrl
        }
      }
      queryClient.setQueryData(["comments", storyId], (old: any) => {
        if (!old) return { pages: [{ items: [data], hasNextPage: false, currentPage: 1 }] };
        const newPages = [...old.pages];
        newPages[0] = {
          ...newPages[0],
          items: [data, ...newPages[0].items].slice(0, COMMENTS_PER_PAGE)
        };
        return { ...old, pages: newPages };
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", storyId] });
    }
  })

  const deleteCommentMutation = useMutation({
    mutationFn: ({ storyId, commentId }: { storyId: string, commentId: string }) => deleteComment(storyId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", storyId] });
    }
  });

  const handleAddComment = () => {
    if (newComment.trim() === "") return;
    if (!user) {
      toast({
        title: "Please login to add a comment",
        description: "You need to be logged in to add a comment",
        variant: "destructive"
      });
      return;
    }
    addCommentToStoryMutation.mutate({
      content: newComment.trim(),
      storyId
    })
    setNewComment("");
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Comments ({data?.pages[0]?.totalComments || 0})</h3>
      
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
            <Button onClick={handleAddComment} disabled={!newComment.trim() || addCommentToStoryMutation.isPending} size="sm" className="gap-2">
              <Send size={16} />
              Post
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment._id} className="flex gap-3">
            <Avatar>
              <AvatarImage src={comment.createdBy.profileImg} />
              <AvatarFallback>{comment.createdBy.username[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{comment.createdBy.username}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString()}</span>
                  {user && user?._id === comment.createdBy._id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => deleteCommentMutation.mutate({ storyId, commentId: comment._id })}
                      disabled={deleteCommentMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
              <p className="mt-1 text-sm">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>

      {hasNextPage && (
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={() => fetchNextPage()} 
            disabled={isLoading || isFetchingNextPage}
            className="gap-2"
          >
            {isLoading || isFetchingNextPage ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
