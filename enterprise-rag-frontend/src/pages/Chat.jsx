import { useState } from 'react';
import ChatHeader from '../components/ChatHeader';
import ChatInput from '../components/ChatInput';
import ChatMessages from '../components/ChatMessages';


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
  
  const handleSendMessage = (content) => {
    const newMessage = {
      id: Date.now(),
      type: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setIsTyping(true);
    
    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'I understand your question. Let me search through your documents to find the most relevant information...',
        timestamp: new Date(),
        sources: ['Document 1.pdf', 'Report 2023.docx']
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 2000);
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