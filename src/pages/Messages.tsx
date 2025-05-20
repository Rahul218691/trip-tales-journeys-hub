
import React from 'react';
import ChatUI from '../components/ChatUI';

const Messages = () => {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Your Messages</h1>
      <ChatUI className="h-[70vh] md:h-[600px]" />
    </div>
  );
};

export default Messages;
