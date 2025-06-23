import { useState } from 'react';
import ChatHeader from '../components/ChatHeader';
import ChatInput from '../components/ChatInput';
import ChatMessages from '../components/ChatMessages';
import { sendMessage } from '../utils/api';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your RAG Assistant. Upload some documents and I\'ll help you find answers from your knowledge base.',
      timestamp: new Date(),
      sources: []
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
  const handleSendMessage = async (content) => {
    const newMessage = {
      id: Date.now(),
      type: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setIsTyping(true);
    
    try {
    const data = await sendMessage(newMessage);
    
    const botMessage = {
      id: Date.now() + 1,
      type: 'bot',
      content: data.response,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, botMessage]);
  } catch (error) {
    console.error('Failed to get bot reply', error);
  } finally {
    setIsTyping(false);
  }

  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <ChatHeader />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatMessages messages={messages} isTyping={isTyping} />
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default Chat;