import { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MapPin, Play, Eye } from "lucide-react";
import CommentSection from "@/components/CommentSection";
import ImageViewer from "@/components/ImageViewer";

// Sample story details
const story = {
  id: "1",
  title: "Island Paradise",
  location: "Bali, Indonesia",
  views: 2458,
  images: [
    "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1504893524553-b855bce32c67?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  ],
  videos: [
    "https://joy1.videvo.net/videvo_files/video/free/video0467/large_watermarked/_import_60e0267b4c3a96.16473365_preview.mp4",
    "https://joy1.videvo.net/videvo_files/video/free/2013-08/large_watermarked/_import_20130806_140157_preview.mp4",
    "https://joy1.videvo.net/videvo_files/video/free/2019-05/large_watermarked/_import_5cf0cd56929bc4.97263447_preview.mp4"
  ],
  author: {
    name: "Julia Chen",
    avatar: "",
  },
  datePosted: "May 15, 2025",
  content: `
    <p>Exploring Bali was a dream come true. From the moment I stepped off the plane, I was enchanted by the island's beauty.</p>
    
    <p>My journey began in Ubud, where I spent days exploring ancient temples nestled in lush forests. The Sacred Monkey Forest was a highlight - watching playful monkeys swing between trees while admiring centuries-old stone carvings was magical.</p>
    
    <p>The beaches of Uluwatu provided the perfect contrast. Perched on dramatic cliffs, I watched surfers ride perfect waves as the sun set over the Indian Ocean.</p>
    
    <p>Perhaps the most memorable experience was joining a local cooking class. We visited the market at dawn to select fresh ingredients, then spent the morning learning traditional Balinese recipes. The flavors were incredible - fresh lemongrass, galangal, and chili came together in perfect harmony.</p>
    
    <p>I left with a full heart and a promise to return. Bali isn't just a destination; it's an experience that changes you.</p>
  `,
  likes: 128,
  comments: [
    {
      id: "c1",
      author: {
        name: "Mark Johnson",
        avatar: "",
      },
      content: "Your photos are incredible! Did you find it easy to get around in Bali?",
      timestamp: "2 days ago",
    },
    {
      id: "c2",
      author: {
        name: "Sarah Williams",
        avatar: "",
      },
      content: "I've been dreaming about going to Bali. This just convinced me to book my ticket!",
      timestamp: "1 day ago",
    }
  ]
};

const StoryDetail = () => {
  const { id } = useParams();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(story.likes);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [initialMediaIndex, setInitialMediaIndex] = useState(0);
  
  // Create image items array for the viewer
  const imageItems = story.images.map(src => ({ type: "image", src } as const));
  
  const toggleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  const openMediaViewer = (index: number) => {
    setInitialMediaIndex(index);
    setViewerOpen(true);
  };

  const handleCloseModal = useCallback(() => {
    setViewerOpen(false);
  }, []);

  return (
    <div className="container py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4 animate-fade-in">{story.title}</h1>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={story.author.avatar} />
              <AvatarFallback>{story.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{story.author.name}</div>
              <div className="text-sm text-muted-foreground">{story.datePosted}</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin size={18} />
              <span>{story.location}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Eye size={18} />
              <span>{story.views.toLocaleString()} views</span>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="col-span-2">
          <img 
            src={story.images[0]} 
            alt={story.title} 
            className="w-full h-[500px] object-cover rounded-lg cursor-pointer transition-transform hover:opacity-90"
            onClick={() => openMediaViewer(0)}
          />
        </div>
        <div>
          <img 
            src={story.images[1]} 
            alt={story.title} 
            className="w-full h-[240px] object-cover rounded-lg cursor-pointer transition-transform hover:opacity-90"
            onClick={() => openMediaViewer(1)}
          />
        </div>
        <div>
          <img 
            src={story.images[2]} 
            alt={story.title} 
            className="w-full h-[240px] object-cover rounded-lg cursor-pointer transition-transform hover:opacity-90"
            onClick={() => openMediaViewer(2)}
          />
        </div>
      </div>

      {/* Media Viewer */}
      <ImageViewer 
        mediaItems={imageItems} 
        initialIndex={initialMediaIndex}
        open={viewerOpen}
        onOpenChange={handleCloseModal}
      />

      {story.videos && story.videos.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {story.videos.map((video, index) => (
              <div 
                key={index} 
                className="aspect-video relative rounded-lg overflow-hidden shadow-md"
              >
                <video 
                  src={video} 
                  className="w-full h-full object-cover"
                  poster={story.images[0]}
                  controls
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-3/4">
          <div 
            className="prose max-w-none mb-10"
            dangerouslySetInnerHTML={{ __html: story.content }}
          />

          {/* Tips Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Travel Tips</h2>
            <div className="bg-muted/50 rounded-lg p-6">
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-sunset/20 flex items-center justify-center">
                    <span className="text-sunset font-medium">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Best Time to Visit</h3>
                    <p className="text-muted-foreground">April to October offers the best weather with less rainfall and perfect conditions for beach activities.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-sunset/20 flex items-center justify-center">
                    <span className="text-sunset font-medium">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Local Transportation</h3>
                    <p className="text-muted-foreground">Rent a scooter for the most flexible way to explore the island. Make sure to have an international driving permit.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-sunset/20 flex items-center justify-center">
                    <span className="text-sunset font-medium">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Cultural Etiquette</h3>
                    <p className="text-muted-foreground">Dress modestly when visiting temples and always ask permission before taking photos of locals.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Highlights Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Trip Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-6">
                {/* <h3 className="font-medium mb-2">Sacred Monkey Forest</h3> */}
                <p className="text-muted-foreground">An enchanting forest sanctuary home to hundreds of playful monkeys and ancient temples.</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-6">
                {/* <h3 className="font-medium mb-2">Uluwatu Beach</h3> */}
                <p className="text-muted-foreground">Stunning cliff-top views and world-class surfing spots with perfect waves.</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-6">
                {/* <h3 className="font-medium mb-2">Local Cooking Class</h3> */}
                <p className="text-muted-foreground">Authentic Balinese cooking experience with fresh market ingredients and traditional recipes.</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-6">
                {/* <h3 className="font-medium mb-2">Temple Visits</h3> */}
                <p className="text-muted-foreground">Ancient temples nestled in lush forests, offering spiritual experiences and architectural wonders.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant={liked ? "default" : "outline"}
              onClick={toggleLike}
              className={`gap-2 ${liked ? "bg-sunset text-white hover:bg-sunset/90" : ""}`}
            >
              <Heart size={18} className={liked ? "fill-white" : ""} />
              {liked ? "Liked" : "Like"} ({likeCount})
            </Button>
          </div>

          <Separator className="my-8" />

          <CommentSection comments={story.comments} />
        </div>

        <div className="w-full lg:w-1/4 mt-8 lg:mt-0">
          {/* Sidebar content can be added later */}
        </div>
      </div>
    </div>
  );
};

export default StoryDetail;
