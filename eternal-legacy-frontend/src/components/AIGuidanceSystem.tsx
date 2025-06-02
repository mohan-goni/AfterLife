import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AIGuidanceSystem = ({ legacyId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const [legacyData, setLegacyData] = useState(null);
  const [showIntroduction, setShowIntroduction] = useState(true);

  // Fetch legacy data
  useEffect(() => {
    const fetchLegacyData = async () => {
      try {
        // This would be replaced with an actual API call
        // const response = await axios.get(`http://localhost:5000/api/legacies/${legacyId}`);
        // setLegacyData(response.data.legacy);
        
        // Mock data for now
        setLegacyData({
          id: legacyId,
          title: "Family Memories",
          owner: {
            first_name: "John",
            last_name: "Doe"
          }
        });
      } catch (error) {
        console.error('Error fetching legacy data:', error);
      }
    };

    if (legacyId) {
      fetchLegacyData();
    }
  }, [legacyId]);

  // Add introduction message when component mounts
  useEffect(() => {
    if (legacyData && showIntroduction) {
      setMessages([
        {
          id: 'intro',
          sender: 'ai',
          content: `Hello, I'm ${legacyData.owner.first_name}'s digital companion. I'm here to guide you through ${legacyData.owner.first_name}'s memories and stories. How can I help you today?`,
          timestamp: new Date().toISOString()
        }
      ]);
      setShowIntroduction(false);
    }
  }, [legacyData, showIntroduction]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // This would be replaced with an actual API call to OpenAI or similar
      // const response = await axios.post('http://localhost:5000/api/ai/chat', {
      //   message: input,
      //   legacyId,
      //   userId: user.id
      // });
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponses = [
          "I'd be happy to tell you more about that memory. It was a special day for our family.",
          "That's a great question. Let me share what I know about that experience.",
          "I remember that moment fondly. Would you like to see some photos from that time?",
          "That's something I've thought about deeply. Here's my perspective on it.",
          "I've prepared some special memories about that. Would you like me to show you?"
        ];
        
        const aiMessage = {
          id: Date.now().toString(),
          sender: 'ai',
          content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Predefined questions/prompts for the user to choose from
  const suggestedPrompts = [
    "Tell me about your childhood",
    "What was your favorite memory?",
    "What advice would you give to future generations?",
    "Show me some important photos",
    "What values were most important to you?"
  ];

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden h-full flex flex-col">
      <div className="p-4 bg-gradient-to-r from-purple-900 to-indigo-800 text-white">
        <h3 className="text-lg font-medium">AI Memory Guide</h3>
        <p className="text-sm opacity-80">
          {legacyData ? `Exploring ${legacyData.owner.first_name}'s memories` : 'Loading...'}
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-3/4 rounded-lg px-4 py-2 ${
                message.sender === 'user' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-3/4">
              <div className="flex space-x-2">
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Suggested prompts */}
      <div className="px-4 py-3 bg-gray-50">
        <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
        <div className="flex flex-wrap gap-2">
          {suggestedPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => {
                setInput(prompt);
              }}
              className="text-xs bg-white border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-100 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
      
      {/* Input area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question or start a conversation..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            rows={2}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className={`px-4 py-2 rounded-lg ${
              !input.trim() || isLoading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIGuidanceSystem;
