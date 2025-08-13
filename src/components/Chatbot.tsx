'use client';

import { useState } from 'react';
import { X, MessageCircle, Bot, Minus, Maximize2, Plus } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Chatbot({ isOpen, onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your Research Assistant. I can help you find research projects, understand funding opportunities, and connect with researchers. What would you like to explore today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showQuestions, setShowQuestions] = useState(true);

  const suggestedQuestions = [
    "Find AI research projects",
    "Show me climate change projects",
    "What funding is available for health research?",
    "Find research opportunities in Germany",
    "Show me recent Horizon Europe projects",
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(text.trim());
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userText: string): string => {
    const lowerText = userText.toLowerCase();
    
    if (lowerText.includes('ai') || lowerText.includes('artificial intelligence') || lowerText.includes('technology')) {
      return "I can help you find AI and technology research projects! Try searching for 'artificial intelligence' in the research domain filter, or browse projects under the ICT and digital innovation categories. Would you like me to show you some specific AI research areas?";
    }
    
    if (lowerText.includes('climate') || lowerText.includes('environment') || lowerText.includes('green')) {
      return "Great choice! Climate and environmental research is very active in European programs. You can search for 'climate' or 'environment' in the research domains, or filter by programme like 'Green Deal'. I can also help you find projects related to renewable energy, sustainability, or carbon reduction.";
    }
    
    if (lowerText.includes('health') || lowerText.includes('medical') || lowerText.includes('medicine')) {
      return "Health and medical research offers excellent opportunities! Look for projects in the 'Health' domain or filter by programmes like 'Health' or 'Marie Skłodowska-Curie'. You can find research in areas like oncology, neuroscience, public health, and medical technologies.";
    }
    
    if (lowerText.includes('funding') || lowerText.includes('budget') || lowerText.includes('money')) {
      return "Funding information is available for all projects! You can filter by budget ranges, see total project costs, and find EC contributions. Most projects range from €100K to several million euros. Would you like to know about specific funding programmes or budget ranges?";
    }
    
    if (lowerText.includes('country') || lowerText.includes('germany') || lowerText.includes('france') || lowerText.includes('spain')) {
      return "You can search by country using the country filter! Just type the country name or browse by region. I can show you projects led by organizations in specific countries or find collaboration opportunities across Europe.";
    }
    
    if (lowerText.includes('horizon') || lowerText.includes('h2020') || lowerText.includes('fp7')) {
      return "European research programmes are well represented in our database! Horizon Europe is the current programme (2021-2027), while H2020 and FP7 are previous programmes with completed projects. You can filter by framework programme to see projects from specific eras.";
    }
    
    return "I understand you're looking for research information. You can use our search filters to find projects by: research domain, country, funding programme, budget range, or organization type. Would you like me to explain any of these search options, or would you prefer to start with a specific research area?";
  };

  if (!isOpen) return null;

  // Minimized view
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-50">
        {/* Minimized Header */}
        <div className="flex items-center justify-between p-3 bg-blue-600 text-white rounded-lg">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            <h3 className="font-semibold text-sm">Research Assistant</h3>
            {messages.length > 1 && (
              <span className="bg-blue-500 text-xs px-2 py-1 rounded-full">
                {messages.length - 1} messages
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(false)}
              className="text-white hover:text-gray-200 transition-colors p-1"
              title="Expand chat"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-1"
              title="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-w-[calc(100vw-2rem)] h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-blue-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <h3 className="font-semibold">Research Assistant</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="text-white hover:text-gray-200 transition-colors p-1"
            title="Minimize chat"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors p-1"
            title="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isUser
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Questions */}
      <div className="px-4 pb-2 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between py-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">Quick questions:</p>
          <button
            onClick={() => setShowQuestions(!showQuestions)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors p-1"
            title={showQuestions ? "Hide questions" : "Show questions"}
          >
            {showQuestions ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>
        
        {showQuestions && (
          <div className="flex flex-wrap gap-1">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(question)}
                className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-40"
          title="Start Chat with Research Assistant"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
      
      <Chatbot isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
