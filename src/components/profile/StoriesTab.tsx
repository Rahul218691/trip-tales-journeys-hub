import { useState, useCallback } from 'react'
import { Link } from "react-router-dom"
import { useQuery } from '@tanstack/react-query'

import { Card } from "@/components/ui/card"
import { MapPin, Calendar } from "lucide-react"
import { DEFAULT_LIST_SIZE } from '@/lib/constants'
import { getStories } from "@/services/story"
import { Spinner } from '@/components/ui/spinner'
import { Button } from "@/components/ui/button"
import Pagination from "@/components/Pagination"

const StoriesTab = ({ userId } : string) => {

    const [currentPage, setCurrentPage] = useState(1)

    const handleFetchStories = useCallback(async(currentPage: number) => {
        try {
            const payload = {
                page: currentPage,
                limit: DEFAULT_LIST_SIZE,
                isMyStories: true,
                userId
            }
            return await getStories(payload)
        } catch (error) {
            console.error("Error fetching stories:", error)
            throw error
        }
    }, [userId])

    const { data: stories, isLoading } = useQuery({
        queryKey: ["user_stories", userId, currentPage],
        queryFn: () => handleFetchStories(currentPage),
        refetchOnReconnect: true,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
        enabled: !!userId
    })

    return (
      <>
        {
          isLoading ? (
            <div className="w-full flex items-center justify-center">
                <Spinner size="lg" />
            </div>
          ) : stories?.items?.length === 0 ? (
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
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stories?.items?.map((story) => (
                        <Link to={`/story/${story._id}`} key={story._id}>
                          <Card className="overflow-hidden card-hover">
                            <div className="aspect-[4/3] relative">
                              <img 
                                src={story.coverImage?.secureUrl || story.coverImage?.url || ''} 
                                alt={story.title} 
                                className="object-cover w-fill h-full"
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
                                  <span>{new Date(story.createdAt).toLocaleDateString()}</span>
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
    )
}

export default StoriesTab 