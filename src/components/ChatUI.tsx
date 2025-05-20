
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  isCurrentUser: boolean;
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

const ChatUI = ({ initialConversations = [], initialMessages = [], className }: ChatUIProps) => {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations.length ? initialConversations : SAMPLE_CONVERSATIONS);
  const [messages, setMessages] = useState<Message[]>(initialMessages.length ? initialMessages : SAMPLE_MESSAGES);
  const [selectedConversationId, setSelectedConversationId] = useState<string>(conversations[0]?.id || '');
  const [messageInput, setMessageInput] = useState('');
  const [isMobileViewActive, setIsMobileViewActive] = useState(false);

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
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: messageInput,
      sender: 'You',
      timestamp: new Date(),
      isCurrentUser: true,
    };
    
    setMessages([...messages, newMessage]);
    setMessageInput('');
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
          ) : (
            <span className="font-medium">Select a conversation</span>
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
                      <p>{message.content}</p>
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
              <Input 
                placeholder="Type a message..." 
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!messageInput.trim()}>
                <Send size={18} />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center p-4">
            <div>
              <p className="text-muted-foreground">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
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
  },
  {
    id: '2',
    content: "Thank you! I'm glad you enjoyed it. Have you been to Japan before?",
    sender: 'You',
    timestamp: new Date(Date.now() - 1000 * 60 * 50),
    isCurrentUser: true,
  },
  {
    id: '3',
    content: "Not yet, but it's on top of my bucket list now after seeing your photos of Kyoto!",
    sender: 'Sarah Parker',
    timestamp: new Date(Date.now() - 1000 * 60 * 40),
    isCurrentUser: false,
  },
  {
    id: '4',
    content: "Kyoto is definitely worth visiting, especially during cherry blossom season. Let me know if you need any recommendations!",
    sender: 'You',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    isCurrentUser: true,
  },
  {
    id: '5',
    content: "I would love some recommendations! How many days do you think I should plan for Kyoto?",
    sender: 'Sarah Parker',
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
    isCurrentUser: false,
  },
  {
    id: '6',
    content: "I'd recommend at least 3-4 days to see the main temples and gardens. Arashiyama bamboo grove is a must-see!",
    sender: 'You',
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    isCurrentUser: true,
  },
];

export default ChatUI;
