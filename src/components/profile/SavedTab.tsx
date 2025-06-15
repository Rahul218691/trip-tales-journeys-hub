import { useState, useCallback } from 'react'
import { Link } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { DEFAULT_LIST_SIZE } from '@/lib/constants'
import { Spinner } from '@/components/ui/spinner'
import Pagination from "@/components/Pagination"
import { getStories, saveUnsaveStory } from "@/services/story"
import { Card } from "@/components/ui/card";
import { MapPin, Calendar, MessageCircle, BookmarkX } from "lucide-react";
import { Button } from "@/components/ui/button"


interface StoriesTabProps {
  userId: string;
}

const SavedTab = ({ userId }: StoriesTabProps) => {

  const queryClient = useQueryClient()

  const [currentPage, setCurrentPage] = useState(1)

  const removeSavedStory = useMutation({
    mutationFn: saveUnsaveStory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_saved_stories'] });
    }
  })

  const handleFetchStories = useCallback(async(currentPage: number) => {
      try {
          const payload = {
              page: currentPage,
              limit: DEFAULT_LIST_SIZE,
              isSavedList: true
          }
          return await getStories(payload)
      } catch (error) {
          console.error("Error fetching stories:", error)
          throw error
      }
  }, [])

  const { data: stories, isLoading } = useQuery({
    queryKey: ["user_saved_stories", userId, currentPage],
    queryFn: () => handleFetchStories(currentPage),
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    enabled: !!userId
  })

  const handleRemoveSavedStory = useCallback((e, storyId) => {
    if (e) e.preventDefault()
    removeSavedStory.mutate(storyId)
  }, [])

  return (
    <>
      {
        isLoading ? (
        <div className="w-full flex items-center justify-center">
            <Spinner size="lg" />
        </div>
        ) : stories?.items?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No saved stories or trips yet.</p>
        </div>
        ) : (
          <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {
                  stories?.items?.map((story) => (
                  <Link to={`/story/${story._id}`} key={story._id}>
                    <Card className="overflow-hidden card-hover">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 aspect-square md:aspect-auto relative">
                          <img 
                            src={story.coverImage?.secureUrl || story.coverImage?.url || ''} 
                            alt={story.title} 
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="p-4 flex-1">
                          <h3 className="font-semibold">{story.title}</h3>
                          <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                            <MapPin size={14} />
                            <span>{story.location}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                            <Calendar size={14} />
                            <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="mt-4 flex items-center gap-2">
                            <div className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                              {story.likes} likes
                            </div>
                            <Button disabled={removeSavedStory.isPending} onClick={(e) => handleRemoveSavedStory(e, story._id)} size="sm" variant="outline" className="ml-auto gap-1 bg-orange-600/90 hover:bg-orange-600 text-white">
                              {
                                removeSavedStory.isPending ? <Spinner size={"md"} className="text-white" /> : (
                                  <>
                                  <BookmarkX size={14} className="text-white" />
                                  <span>Remove</span>
                                  </>
                                )
                              }
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                  ))
                }
              </div>
              <div className="mt-8">
                  <Pagination
                      currentPage={currentPage}
                      onPageChange={setCurrentPage}
                      hasNextPage={stories?.hasNextPage}
                      hasPrevPage={stories?.hasPrevPage}
                  />
              </div>             
          </>
        )
      }
    </>
  );
};

export default SavedTab; 