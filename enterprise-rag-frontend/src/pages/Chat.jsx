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
    const timestamp = new Date();
    const id = Date.now();

    const userMessage = {
      id,
      type: 'user',
      content,
      timestamp
    };

    // Only add user message initially
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      let fullMessage = '';
      let botMessageAdded = false;
      const botId = id + 1;

      await sendMessage(
        {
          id,
          type: 'user',
          content,
          timestamp: timestamp.toISOString()
        },
        (chunk) => {
          fullMessage += chunk;

          if (!botMessageAdded) {
            // Add bot message on first chunk
            setMessages(prev => [...prev, {
              id: botId,
              type: 'bot',
              content: fullMessage,
              timestamp,
              sources: []
            }]);
            botMessageAdded = true;
          } else {
            // Update existing bot message
            setMessages(prev =>
              prev.map(msg =>
                msg.id === botId ? { ...msg, content: fullMessage } : msg
              )
            );
          }
        }
      );
    } catch (error) {
      console.error('Streaming failed:', error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 2,
          type: 'bot',
          content: '⚠️ Sorry, something went wrong while fetching the response.',
          timestamp: new Date(),
        }
      ]);
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
