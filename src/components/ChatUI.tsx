
import React, { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Image, Smile, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import ImageViewer from "./ImageViewer";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  isCurrentUser: boolean;
  type?: 'text' | 'image' | 'link';
  mediaUrl?: string;
}

interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  unread?: number;
  timestamp: Date;
}

interface ChatUIProps {
  initialConversations?: Conversation[];
  initialMessages?: Message[];
  className?: string;
}

const EMOJIS = ['😀', '😂', '🥰', '😍', '😎', '🙌', '👍', '🎉', '🌍', '✨', '🔥', '💯'];

const ChatUI = ({ initialConversations = [], initialMessages = [], className }: ChatUIProps) => {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations.length ? initialConversations : SAMPLE_CONVERSATIONS);
  const [messages, setMessages] = useState<Message[]>(initialMessages.length ? initialMessages : SAMPLE_MESSAGES);
  const [selectedConversationId, setSelectedConversationId] = useState<string>(conversations[0]?.id || '');
  const [messageInput, setMessageInput] = useState('');
  const [isMobileViewActive, setIsMobileViewActive] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerImage, setViewerImage] = useState<{ type: "image" | "video"; src: string }[]>([]);
  const [viewerIndex, setViewerIndex] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedConversation = conversations.find(conv => conv.id === selectedConversationId);
  
  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
    // On mobile, switch to message view when selecting a conversation
    setIsMobileViewActive(true);
  };

  const handleBackToConversations = () => {
    setIsMobileViewActive(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    
    // Detect if message contains a URL
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const hasUrl = urlRegex.test(messageInput);
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: messageInput,
      sender: 'You',
      timestamp: new Date(),
      isCurrentUser: true,
      type: hasUrl ? 'link' : 'text',
    };
    
    setMessages([...messages, newMessage]);
    setMessageInput('');
  };

  const handleAddEmoji = (emoji: string) => {
    setMessageInput(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          const newMessage: Message = {
            id: Date.now().toString(),
            content: "Sent an image",
            sender: 'You',
            timestamp: new Date(),
            isCurrentUser: true,
            type: 'image',
            mediaUrl: result
          };
          
          setMessages(prev => [...prev, newMessage]);
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Unsupported file type",
          description: "Only image files are supported.",
          variant: "destructive"
        });
      }
    });

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleViewImage = (mediaUrl: string, index: number) => {
    setViewerImage([{ type: "image", src: mediaUrl }]);
    setViewerIndex(index);
    setViewerOpen(true);
  };

  // Function to linkify text (convert URLs to clickable links)
  const linkifyText = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a 
            key={i} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-500 underline hover:text-blue-700"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };
  
  return (
    <div className={cn("flex h-[600px] border rounded-lg overflow-hidden bg-background", className)}>
      {/* Conversations panel - hidden on mobile when a conversation is active */}
      <div 
        className={cn(
          "w-full md:w-1/3 border-r",
          isMobileViewActive ? "hidden md:block" : "block"
        )}
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Messages</h2>
        </div>
        
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100%-65px)] p-4 text-center">
            <div className="bg-gray-100 rounded-full p-6 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square text-muted-foreground"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
            <p className="text-muted-foreground">Start messaging with travelers from around the world</p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(600px-65px)]">
            {conversations.map((conversation) => (
              <div 
                key={conversation.id}
                className={cn(
                  "flex items-start p-4 gap-3 cursor-pointer hover:bg-muted/50 transition-colors",
                  selectedConversationId === conversation.id && "bg-muted"
                )}
                onClick={() => handleSelectConversation(conversation.id)}
              >
                <Avatar>
                  <AvatarImage src={conversation.avatar} />
                  <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <span className="font-medium truncate">{conversation.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(conversation.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                </div>
                {conversation.unread && (
                  <div className="flex-shrink-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs text-primary-foreground">{conversation.unread}</span>
                  </div>
                )}
              </div>
            ))}
          </ScrollArea>
        )}
      </div>
      
      {/* Messages panel - shown on mobile only when a conversation is active */}
      <div 
        className={cn(
          "flex flex-col w-full md:w-2/3",
          !isMobileViewActive && !selectedConversation ? "hidden md:flex" : "flex"
        )}
      >
        <div className="p-4 border-b flex items-center gap-3">
          {/* Back button - only on mobile */}
          {selectedConversation && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden mr-1"
              onClick={handleBackToConversations}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
              <span className="sr-only">Back</span>
            </Button>
          )}
          
          {selectedConversation ? (
            <>
              <Avatar className="h-8 w-8">
                <AvatarImage src={selectedConversation.avatar} />
                <AvatarFallback>{selectedConversation.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{selectedConversation.name}</span>
            </>
          ) : conversations.length > 0 ? (
            <span className="font-medium">Select a conversation</span>
          ) : (
            <span className="font-medium">No conversations</span>
          )}
        </div>
        
        {selectedConversation ? (
          <>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={cn(
                      "flex",
                      message.isCurrentUser ? "justify-end" : "justify-start"
                    )}
                  >
                    <div 
                      className={cn(
                        "max-w-[80%] rounded-lg p-3",
                        message.isCurrentUser 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted"
                      )}
                    >
                      {message.type === 'image' && message.mediaUrl && (
                        <div 
                          className="mb-2 cursor-pointer"
                          onClick={() => handleViewImage(message.mediaUrl!, 0)}
                        >
                          <img 
                            src={message.mediaUrl} 
                            alt="Shared image" 
                            className="rounded max-w-full max-h-[200px] object-contain"
                          />
                        </div>
                      )}
                      
                      {message.type === 'link' ? (
                        <p>{linkifyText(message.content)}</p>
                      ) : (
                        <p>{message.content}</p>
                      )}
                      
                      <p className={cn(
                        "text-xs mt-1",
                        message.isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <form onSubmit={handleSendMessage} className="border-t p-4 flex gap-2">
              <div className="relative flex-1 flex">
                <Input 
                  placeholder="Type a message..." 
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 pr-20"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Image size={18} />
                    <span className="sr-only">Attach image</span>
                  </Button>
                  
                  <div className="relative">
                    <Button 
                      type="button" 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <Smile size={18} />
                      <span className="sr-only">Add emoji</span>
                    </Button>
                    
                    {showEmojiPicker && (
                      <div className="absolute bottom-10 right-0 bg-background border shadow-lg rounded-lg p-2 z-10 flex flex-wrap gap-1 w-[200px]">
                        {EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => handleAddEmoji(emoji)}
                            className="hover:bg-muted rounded p-1 text-lg"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileSelection}
              />
              
              <Button type="submit" size="icon" disabled={!messageInput.trim()}>
                <Send size={18} />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </>
        ) : conversations.length > 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <div className="bg-gray-100 rounded-full p-8 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M22 10V8a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v12a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5v-2"/><rect width="6" height="10" x="9" y="7" rx="2"/><path d="m15 11 5-5m0 5v-5h-5"/></svg>
            </div>
            <h3 className="text-xl font-medium mb-2">Select a conversation</h3>
            <p className="text-muted-foreground">Choose from your existing conversations to start chatting.</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <div className="bg-gray-100 rounded-full p-8 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <h3 className="text-xl font-medium mb-2">No conversations yet</h3>
            <p className="text-muted-foreground">Start connecting with fellow travelers to share travel tips and stories.</p>
          </div>
        )}
      </div>
      
      {/* Image viewer for fullscreen images */}
      <ImageViewer 
        mediaItems={viewerImage}
        initialIndex={viewerIndex}
        open={viewerOpen}
        onOpenChange={setViewerOpen}
      />
    </div>
  );
};

// Helper functions
const formatDate = (date: Date) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterday = new Date(today - 86400000).getTime();
  const inputDate = new Date(date).getTime();
  
  if (inputDate >= today) {
    return formatTime(date);
  } else if (inputDate >= yesterday) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric',
    minute: '2-digit',
    hour12: true 
  });
};

// Sample data
const SAMPLE_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    name: 'Sarah Parker',
    lastMessage: 'Yes, that sounds great!',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    unread: 2,
  },
  {
    id: '2',
    name: 'Mike Johnson',
    lastMessage: 'Remember to bring your camera',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: '3',
    name: 'Lisa Wong',
    lastMessage: 'The hiking trail was amazing!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: '4',
    name: 'Carlos Rodriguez',
    lastMessage: 'Did you get my photos from Barcelona?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    unread: 1,
  },
];

const SAMPLE_MESSAGES: Message[] = [
  {
    id: '1',
    content: "Hi there! I saw your travel story about Japan. It was amazing!",
    sender: 'Sarah Parker',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    isCurrentUser: false,
    type: 'text'
  },
  {
    id: '2',
    content: "Thank you! I'm glad you enjoyed it. Have you been to Japan before?",
    sender: 'You',
    timestamp: new Date(Date.now() - 1000 * 60 * 50),
    isCurrentUser: true,
    type: 'text'
  },
  {
    id: '3',
    content: "Not yet, but it's on top of my bucket list now after seeing your photos of Kyoto!",
    sender: 'Sarah Parker',
    timestamp: new Date(Date.now() - 1000 * 60 * 40),
    isCurrentUser: false,
    type: 'text'
  },
  {
    id: '4',
    content: "Kyoto is definitely worth visiting, especially during cherry blossom season. Let me know if you need any recommendations!",
    sender: 'You',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    isCurrentUser: true,
    type: 'text'
  },
  {
    id: '5',
    content: "I would love some recommendations! How many days do you think I should plan for Kyoto?",
    sender: 'Sarah Parker',
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
    isCurrentUser: false,
    type: 'text'
  },
  {
    id: '6',
    content: "I'd recommend at least 3-4 days to see the main temples and gardens. Arashiyama bamboo grove is a must-see!",
    sender: 'You',
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    isCurrentUser: true,
    type: 'text'
  },
  {
    id: '7',
    content: "Check out this map of Kyoto's main attractions: https://www.google.com/maps/d/viewer?mid=1l8nkCJkZBjcB5zUTEF0lvJ2AuYs",
    sender: 'You',
    timestamp: new Date(Date.now() - 1000 * 60 * 8),
    isCurrentUser: true,
    type: 'link'
  },
];

export default ChatUI;
