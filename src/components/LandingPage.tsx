'use client';

import { useState } from 'react';
import { Check, Users, Award, Globe, ArrowRight, BookOpen, MessageCircle, Database, Send, X, Bot } from 'lucide-react';
import { Dashboard } from '@/components/Dashboard';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';


export function LandingPage() {
  const [showApp, setShowApp] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: '1',
      text: "Welcome to Research Support! I can help you with common research challenges. Please select a topic below or type your specific question.",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  const predefinedIssues = [
    { 
      category: "Contact Support",
      question: "How can I get help?", 
      solution: "📧 For personalized support and assistance, please reach out to us at: smlsmohan111@gmail.com\n\nWe typically respond within 24 hours and are here to help with any questions about the platform, research guidance, or technical issues." 
    },
    { 
      category: "Getting Started",
      question: "How do I start using the platform?", 
      solution: "🚀 Getting started is easy!\n1. Click 'Launch App' to access the research dashboard\n2. Use the search filters to find projects in your field\n3. Browse by research domains, funding amounts, or countries\n4. Click on project cards to see full details\n5. Use 'Find Contacts' to connect with researchers" 
    },
    { 
      category: "Funding Search",
      question: "How to find funding opportunities?", 
      solution: "💰 To find funding opportunities:\n• Use budget filters (€50K - €50M+)\n• Look for 'SIGNED' status projects as examples\n• Check Horizon Europe, H2020, and FP7 programmes\n• Filter by research domains that match your interests\n• Typical ranges: PhD €150K, Postdoc €200K, Research Grants €1M+" 
    },
    { 
      category: "Research Networking",
      question: "How to find researchers in my field?", 
      solution: "🔍 Find researchers by:\n• Using research domain filters (AI, climate, health, etc.)\n• Searching by organization or country\n• Looking at project coordinator roles\n• Checking participant organizations\n• Using the 'Find Contacts' feature on project cards" 
    },
    { 
      category: "Technical Issues",
      question: "The platform is slow or not working", 
      solution: "⚡ If you're experiencing technical issues:\n• Try refreshing the page\n• Clear your browser cache\n• Check your internet connection\n• Try a different browser\n\nFor persistent issues, contact us at: smlsmohan111@gmail.com" 
    },
    { 
      category: "Data Information",
      question: "What data sources do you use?", 
      solution: "📊 Our data comes from:\n• Official CORDIS database (European Commission)\n• 79,069+ research projects\n• Covering Horizon Europe, H2020, and FP7 programmes\n• Updated regularly with the latest project information\n• All data is verified and quality-assured" 
    }
  ];

  const handleChatSend = (text: string) => {
    if (!text.trim()) return;
    
    setChatMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    }]);
    
    setChatInput('');
    
    // Quick response system
    setTimeout(() => {
      let response = generateResponse(text.trim());
      
      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      }]);
    }, 300); // Reduced from 1000ms to 300ms
  };

  const generateResponse = (userText: string): string => {
    const lowerText = userText.toLowerCase();
    
    // Quick keyword matching for fast responses
    if (lowerText.includes('contact') || lowerText.includes('help') || lowerText.includes('support') || lowerText.includes('email')) {
      return predefinedIssues[0].solution; // Contact Support
    }
    
    if (lowerText.includes('funding') || lowerText.includes('money') || lowerText.includes('budget') || lowerText.includes('grant')) {
      return predefinedIssues[2].solution; // Funding Search
    }
    
    if (lowerText.includes('start') || lowerText.includes('begin') || lowerText.includes('how to use') || lowerText.includes('getting started')) {
      return predefinedIssues[1].solution; // Getting Started
    }
    
    if (lowerText.includes('researcher') || lowerText.includes('network') || lowerText.includes('collaborate') || lowerText.includes('find people')) {
      return predefinedIssues[3].solution; // Research Networking
    }
    
    if (lowerText.includes('slow') || lowerText.includes('error') || lowerText.includes('not working') || lowerText.includes('problem')) {
      return predefinedIssues[4].solution; // Technical Issues
    }
    
    if (lowerText.includes('data') || lowerText.includes('source') || lowerText.includes('database') || lowerText.includes('information')) {
      return predefinedIssues[5].solution; // Data Information
    }
    
    // Default response
    return "👋 Hi! I'm here to help with quick support questions. Please select one of the options below for instant answers, or contact us directly at smlsmohan111@gmail.com for personalized assistance.";
  };

  const handlePredefinedClick = (issue: typeof predefinedIssues[0]) => {
    handleChatSend(issue.question);
  };

  if (showApp) {
    return (
      <div className="min-h-screen theme-bg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setShowApp(false)}
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 warm:text-amber-600 hover:text-blue-800 dark:hover:text-blue-300 warm:hover:text-amber-800 transition-colors"
            >
              ← Back to Home
            </button>
            <div className="text-sm text-muted-foreground">
              Research Assistant Mode
            </div>
          </div>
          <Dashboard />
        </div>
        {/* Inline Chatbot */}
        {!showChatbot && (
          <button
            onClick={() => setShowChatbot(true)}
            className="fixed bottom-4 right-4 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-40"
            title="Get Research Support"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
        )}
        
        {showChatbot && (
          <div className="fixed bottom-4 right-4 w-96 max-w-[calc(100vw-2rem)] h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-50">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-blue-600 text-white rounded-t-lg">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <h3 className="font-semibold">Research Support</h3>
              </div>
              <button
                onClick={() => setShowChatbot(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message) => (
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
            </div>
            
            {/* Predefined Issues (show always) */}
            <div className="px-4 pb-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Select a support topic:</p>
              <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto">
                {predefinedIssues.map((issue, index) => (
                  <button
                    key={index}
                    onClick={() => handlePredefinedClick(issue)}
                    className="text-xs px-2 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-left"
                  >
                    <span className="font-medium">{issue.category}:</span> {issue.question}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleChatSend(chatInput)}
                  placeholder="Ask me about research opportunities..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                />
                <button
                  onClick={() => handleChatSend(chatInput)}
                  disabled={!chatInput.trim()}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen theme-bg">
      {/* Navigation */}
      <nav className="theme-nav sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold theme-text">Student Research Assistant</h1>
                <p className="text-sm text-muted-foreground">CORDIS Explorer</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="text-muted-foreground hover:text-blue-600 transition-colors">Features</a>
              <a href="#support" className="text-muted-foreground hover:text-blue-600 transition-colors">Support</a>
              <ThemeSwitcher />
              <button
                onClick={() => setShowApp(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Launch App
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section theme-bg py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold theme-text mb-6">
            Your AI-Powered
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 warm:from-amber-600 warm:to-orange-600 bg-clip-text text-transparent"> Research Companion</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-8">
            Discover 79,069+ European research opportunities, connect with leading professors, 
            find funding, and accelerate your academic journey with intelligent insights.
          </p>
          <div className="flex justify-center mb-12">
            <button
              onClick={() => setShowApp(true)}
              className="bg-blue-600 dark:bg-blue-500 warm:bg-amber-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 warm:hover:bg-amber-700 transition-colors font-semibold text-lg flex items-center gap-2 justify-center"
            >
              Start Exploring Research
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span>79,069+ Projects</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>27+ Countries</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>10,000+ Organizations</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 theme-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold theme-text mb-4">
              Everything You Need for Research Success
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From discovery to connection, our platform provides all the tools you need to excel in your research journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="theme-card rounded-xl p-8 border theme-border">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 warm:bg-amber-100 rounded-lg flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400 warm:text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold theme-text mb-4">Smart Research Discovery</h3>
              <p className="text-muted-foreground mb-6">
                AI-powered search across all European research programs. Find exactly what you&apos;re looking for with intelligent filtering and recommendations.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Advanced search filters
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Research domain categorization
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Real-time project updates
                </li>
              </ul>
            </div>

            <div className="theme-card rounded-xl p-8 border theme-border">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 warm:bg-emerald-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400 warm:text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold theme-text mb-4">Network Building</h3>
              <p className="text-muted-foreground mb-6">
                Connect with researchers, professors, and institutions across Europe. Build meaningful academic relationships that advance your career.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Direct researcher contacts
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Institution profiles
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Collaboration matching
                </li>
              </ul>
            </div>

            <div className="theme-card rounded-xl p-8 border theme-border">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 warm:bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <Award className="w-6 h-6 text-purple-600 dark:text-purple-400 warm:text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold theme-text mb-4">Funding Intelligence</h3>
              <p className="text-muted-foreground mb-6">
                Understand funding patterns, successful project structures, and identify the best opportunities for your research goals.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Budget analysis & trends
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Success rate insights
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Program comparisons
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section id="support" className="py-20 theme-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold theme-text mb-4">
              Get the Support You Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We&apos;re here to help you succeed in your research journey. From technical questions to research guidance, 
              our team is ready to assist.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 max-w-md mx-auto">
            <div className="theme-card rounded-lg p-8 text-center border theme-border">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 warm:bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-blue-600 dark:text-blue-400 warm:text-amber-600" />
              </div>
              <h3 className="text-xl font-bold theme-text mb-4">AI Research Assistant</h3>
              <p className="text-muted-foreground mb-6">
                Get instant help with our AI-powered research assistant. Available 24/7 to help you find the perfect research opportunities.
              </p>
              <button 
                onClick={() => setShowChatbot(true)}
                className="bg-blue-600 dark:bg-blue-500 warm:bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 warm:hover:bg-amber-700 transition-colors"
              >
                Start Chat
              </button>
            </div>
          </div>

          {/* Data Acquisition Information */}
          <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 warm:from-amber-50 warm:to-orange-50 rounded-xl p-8 border theme-border">
            <div className="text-center">
              <h3 className="text-2xl font-bold theme-text mb-4">About Our Data</h3>
              <p className="text-muted-foreground max-w-3xl mx-auto mb-6">
                Our comprehensive database is built from official CORDIS data, ensuring accuracy and completeness. 
                All information is sourced directly from the European Commission&apos;s Community Research and Development Information Service.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 warm:text-amber-600">Official Source</div>
                  <p className="text-muted-foreground">CORDIS Database</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 warm:text-emerald-600">Daily Updates</div>
                  <p className="text-muted-foreground">Fresh Data</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 warm:text-orange-600">Verified</div>
                  <p className="text-muted-foreground">Quality Assured</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 warm:bg-amber-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 warm:from-amber-600 warm:to-orange-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">Student Research Assistant</h3>
                  <p className="text-sm text-gray-400 warm:text-amber-200">CORDIS Explorer</p>
                </div>
              </div>
              <p className="text-gray-400 warm:text-amber-200 text-sm">
                Empowering students to discover, connect, and excel in European research.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400 warm:text-amber-200">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Updates</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400 warm:text-amber-200">
                <li><a href="#support" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400 warm:text-amber-200">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Data Sources</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 warm:border-amber-800 mt-8 pt-8 text-center text-sm text-gray-400 warm:text-amber-200">
            <p>&copy; 2025 Student Research Assistant App. Built with data from CORDIS - European Commission.</p>
          </div>
        </div>
      </footer>
      
      {/* Chatbot for landing page */}
      {!showChatbot && (
        <button
          onClick={() => setShowChatbot(true)}
          className="fixed bottom-4 right-4 w-14 h-14 bg-blue-600 dark:bg-blue-500 warm:bg-amber-600 hover:bg-blue-700 dark:hover:bg-blue-600 warm:hover:bg-amber-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-40"
          title="Get Research Support"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
      
      {showChatbot && (
        <div className="fixed bottom-4 right-4 w-96 max-w-[calc(100vw-2rem)] h-[500px] theme-card rounded-lg shadow-2xl border theme-border flex flex-col z-50">
          <div className="flex items-center justify-between p-4 border-b theme-border bg-blue-600 dark:bg-blue-500 warm:bg-amber-600 text-white rounded-t-lg">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <h3 className="font-semibold">Research Assistant</h3>
            </div>
            <button
              onClick={() => setShowChatbot(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isUser
                      ? 'bg-blue-600 dark:bg-blue-500 warm:bg-amber-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 warm:bg-amber-50 text-gray-900 dark:text-white warm:text-amber-900'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Predefined Issues for Landing Page Chatbot */}
          <div className="px-4 pb-2 border-t theme-border">
            <p className="text-xs text-muted-foreground mb-2">Select a support topic:</p>
            <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto">
              {predefinedIssues.map((issue, index) => (
                <button
                  key={index}
                  onClick={() => handlePredefinedClick(issue)}
                  className="text-xs px-2 py-1.5 bg-blue-100 dark:bg-blue-900 warm:bg-amber-100 text-blue-700 dark:text-blue-300 warm:text-amber-700 rounded hover:bg-blue-200 dark:hover:bg-blue-800 warm:hover:bg-amber-200 transition-colors text-left"
                >
                  <span className="font-medium">{issue.category}:</span> {issue.question}
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-4 border-t theme-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChatSend(chatInput)}
                placeholder="Ask me about research opportunities..."
                className="flex-1 px-3 py-2 border theme-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 warm:focus:ring-amber-500 theme-bg theme-text text-sm"
              />
              <button
                onClick={() => handleChatSend(chatInput)}
                disabled={!chatInput.trim()}
                className="px-3 py-2 bg-blue-600 dark:bg-blue-500 warm:bg-amber-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 warm:hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
