import React, { useState, useRef, useEffect } from 'react';


const ChatInput = ({ onSendMessage }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <div className="border-t border-slate-200 bg-white px-6 py-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end space-x-3 bg-slate-50 rounded-2xl border border-slate-200 focus-within:border-indigo-300 focus-within:bg-white transition-all duration-200">
            {/* Attachment button */}
            <button
              type="button"
              className="flex-shrink-0 p-3 text-slate-500 hover:text-slate-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            
            {/* Text input */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your documents..."
              className="flex-1 resize-none bg-transparent border-none outline-none py-3 text-slate-800 placeholder-slate-500 max-h-32 min-h-[24px]"
              rows="1"
            />
            
            {/* Send button */}
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex-shrink-0 p-3 m-1 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          
          {/* Helper text */}
          <p className="text-xs text-slate-500 mt-2 flex items-center">
            <kbd className="px-1.5 py-0.5 text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-300 rounded">Enter</kbd>
            <span className="ml-1">to send, </span>
            <kbd className="px-1.5 py-0.5 text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-300 rounded ml-1">Shift + Enter</kbd>
            <span className="ml-1">for new line</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;