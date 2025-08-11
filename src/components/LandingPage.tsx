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
      text: "Hello! I'm your Research Assistant. I can help you with common research challenges and opportunities. What would you like to explore?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  const predefinedIssues = [
    { 
      question: "How to find funding opportunities?", 
      solution: "Use our budget filters to find projects in your range. Look for active programmes like Horizon Europe, Marie Skłodowska-Curie Actions, or ERC grants. Filter by 'SIGNED' status to see currently funded projects for inspiration." 
    },
    { 
      question: "Can't find researchers in my field", 
      solution: "Try using the research domain filter with keywords like 'machine learning', 'climate change', or 'biotechnology'. Also check the organization roles to find coordinators and participants in your area." 
    },
    { 
      question: "How to contact project coordinators?", 
      solution: "Click 'Find Contacts' on any project card. If contact details aren't available, use the project DOI or search for the organization online. Many coordinators are listed on university websites." 
    },
    { 
      question: "What's the difference between programmes?", 
      solution: "Horizon Europe (2021-2027) is current, H2020 (2014-2020) is finished but great for learning. FP7 (2007-2013) shows historical trends. Use the framework filter to compare funding patterns." 
    },
    { 
      question: "How to find collaboration opportunities?", 
      solution: "Look for projects with multiple organizations from different countries. Check the 'roles' to see who are coordinators vs participants. Search by your country to find local partners." 
    },
    { 
      question: "Budget information seems unclear", 
      solution: "EC Max Contribution is the EU funding amount. Total Cost includes partner contributions. Use budget filters to find projects in your scale. Most PhD/postdoc positions are €50K-200K." 
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
    
    // Enhanced response system
    setTimeout(() => {
      let response = generateResponse(text.trim());
      
      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      }]);
    }, 1000);
  };

  const generateResponse = (userText: string): string => {
    const lowerText = userText.toLowerCase();
    
    // Check for predefined issues
    const matchedIssue = predefinedIssues.find(issue => 
      lowerText.includes(issue.question.toLowerCase().split(' ').slice(0, 3).join(' '))
    );
    
    if (matchedIssue) {
      return matchedIssue.solution;
    }
    
    // Domain-specific responses
    if (lowerText.includes('ai') || lowerText.includes('artificial intelligence') || lowerText.includes('machine learning')) {
      return "🤖 AI Research is booming! Try searching for 'artificial intelligence', 'machine learning', or 'deep learning' in research domains. Top programs include Digital Europe Programme and Horizon Europe Cluster 4 (Digital, Industry and Space). Budget range: €100K-€3M typically.";
    }
    
    if (lowerText.includes('climate') || lowerText.includes('environment') || lowerText.includes('green')) {
      return "🌱 Climate research is a top priority! Search for 'climate', 'environment', or 'sustainability' domains. Look for Green Deal projects and Horizon Europe Cluster 5. Many opportunities in renewable energy, carbon capture, and climate adaptation. Budget: €200K-€10M+.";
    }
    
    if (lowerText.includes('health') || lowerText.includes('medical') || lowerText.includes('medicine')) {
      return "🏥 Health research offers excellent opportunities! Search 'health', 'medical', or 'biomedical' domains. Check Horizon Europe Cluster 1 (Health) and Marie Skłodowska-Curie Actions. Popular areas: cancer research, digital health, personalized medicine. Budget: €150K-€15M.";
    }
    
    if (lowerText.includes('funding') || lowerText.includes('money') || lowerText.includes('budget')) {
      return "💰 For funding info: Use budget filters (€50K-€50M+). Check 'EC Max Contribution' for EU funding amount. Popular ranges: PhD €150K, Postdoc €200K, Starting Grant €1.5M, Advanced Grant €2.5M. Look for 'SIGNED' status projects as examples.";
    }
    
    if (lowerText.includes('contact') || lowerText.includes('network') || lowerText.includes('collaborate')) {
      return "🤝 For networking: Use 'Find Contacts' on project cards. Filter by your country to find local researchers. Look for coordinator roles for project leaders. Search organizations by name to find their other projects. Many contacts available through university websites.";
    }
    
    if (lowerText.includes('how') || lowerText.includes('help') || lowerText.includes('guide')) {
      return "📚 I can help with: Finding funding opportunities, connecting with researchers, understanding budget ranges, exploring research domains, finding collaboration partners, and navigating European programmes. What specific area interests you?";
    }
    
    return "I understand you're looking for research information. Try asking about: funding opportunities, finding researchers, collaboration, budget information, or specific research domains like AI, climate, or health. You can also explore our predefined solutions for common research challenges!";
  };

  const handlePredefinedClick = (issue: typeof predefinedIssues[0]) => {
    handleChatSend(issue.question);
  };

  if (showApp) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setShowApp(false)}
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              ← Back to Home
            </button>
            <div className="text-sm text-gray-500 dark:text-gray-400">
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
            title="Start Chat with Research Assistant"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
        )}
        
        {showChatbot && (
          <div className="fixed bottom-4 right-4 w-96 max-w-[calc(100vw-2rem)] h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-50">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-blue-600 text-white rounded-t-lg">
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
            
            {/* Predefined Issues (show only initially) */}
            {chatMessages.length === 1 && (
              <div className="px-4 pb-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Common research challenges:</p>
                <div className="grid grid-cols-1 gap-1 max-h-32 overflow-y-auto">
                  {predefinedIssues.slice(0, 4).map((issue, index) => (
                    <button
                      key={index}
                      onClick={() => handlePredefinedClick(issue)}
                      className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-left"
                    >
                      {issue.question}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
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
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Student Research Assistant</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">CORDIS Explorer</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Features</a>
              <a href="#pricing" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Pricing</a>
              <a href="#support" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Support</a>
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
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            Your AI-Powered
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Research Companion</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8">
            Discover 79,069+ European research opportunities, connect with leading professors, 
            find funding, and accelerate your academic journey with intelligent insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => setShowApp(true)}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg flex items-center gap-2 justify-center"
            >
              Start Exploring Research
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-semibold text-lg">
              Watch Demo
            </button>
          </div>
          <div className="flex items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
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
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need for Research Success
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              From discovery to connection, our platform provides all the tools you need to excel in your research journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Smart Research Discovery</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                AI-powered search across all European research programs. Find exactly what you&apos;re looking for with intelligent filtering and recommendations.
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
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

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Network Building</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Connect with researchers, professors, and institutions across Europe. Build meaningful academic relationships that advance your career.
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
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

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-6">
                <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Funding Intelligence</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Understand funding patterns, successful project structures, and identify the best opportunities for your research goals.
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
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

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, Student-Friendly Pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Start free, upgrade when you&apos;re ready to dive deeper into research opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Free Explorer</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Perfect for getting started</p>
                <div className="text-4xl font-bold text-gray-900 dark:text-white">Free</div>
                <p className="text-gray-600 dark:text-gray-400">5 searches included</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 dark:text-gray-300">5 research searches</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 dark:text-gray-300">Basic project information</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 dark:text-gray-300">Standard filters</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 dark:text-gray-300">Email support</span>
                </li>
              </ul>
              <button 
                onClick={() => setShowApp(true)}
                className="w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Start Free
              </button>
            </div>

            {/* Monthly Plan */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border-2 border-blue-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Monthly Pro</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">For active researchers</p>
                <div className="text-4xl font-bold text-blue-600">€5</div>
                <p className="text-gray-600 dark:text-gray-400">per month</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 dark:text-gray-300">Unlimited searches</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 dark:text-gray-300">Advanced filters & domains</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 dark:text-gray-300">Contact information access</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 dark:text-gray-300">Export capabilities</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 dark:text-gray-300">Priority support</span>
                </li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Start Monthly Plan
              </button>
            </div>

            {/* Annual Plan */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Annual Pro</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Best value for committed researchers</p>
                <div className="text-4xl font-bold text-purple-600">€50</div>
                <p className="text-gray-600 dark:text-gray-400">per year</p>
                <p className="text-sm text-green-600 font-medium">Save €10/year</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 dark:text-gray-300">Everything in Monthly Pro</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 dark:text-gray-300">Advanced analytics</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 dark:text-gray-300">Research trend reports</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 dark:text-gray-300">Custom alerts</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 dark:text-gray-300">Dedicated support</span>
                </li>
              </ul>
              <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                Start Annual Plan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section id="support" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Get the Support You Need
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              We&apos;re here to help you succeed in your research journey. From technical questions to research guidance, 
              our team is ready to assist.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 max-w-md mx-auto">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">AI Research Assistant</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Get instant help with our AI-powered research assistant. Available 24/7 to help you find the perfect research opportunities.
              </p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Start Chat
              </button>
            </div>
          </div>

          {/* Data Acquisition Information */}
          <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About Our Data</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6">
                Our comprehensive database is built from official CORDIS data, ensuring accuracy and completeness. 
                All information is sourced directly from the European Commission&apos;s Community Research and Development Information Service.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">Official Source</div>
                  <p className="text-gray-600 dark:text-gray-400">CORDIS Database</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">Daily Updates</div>
                  <p className="text-gray-600 dark:text-gray-400">Fresh Data</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">Verified</div>
                  <p className="text-gray-600 dark:text-gray-400">Quality Assured</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">Student Research Assistant</h3>
                  <p className="text-sm text-gray-400">CORDIS Explorer</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering students to discover, connect, and excel in European research.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
                <li><a href="#" className="hover:text-white">Updates</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#support" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Community</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Data Sources</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Student Research Assistant App. Built with data from CORDIS - European Commission.</p>
          </div>
        </div>
      </footer>
      
      {/* Chatbot for landing page */}
      {!showChatbot && (
        <button
          onClick={() => setShowChatbot(true)}
          className="fixed bottom-4 right-4 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-40"
          title="Start Chat with Research Assistant"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
      
      {showChatbot && (
        <div className="fixed bottom-4 right-4 w-96 max-w-[calc(100vw-2rem)] h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-50">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-blue-600 text-white rounded-t-lg">
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
