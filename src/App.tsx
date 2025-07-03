import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Database, 
  TrendingUp, 
  Brain, 
  FileText, 
  Settings,
  Sun,
  Moon,
  MessageCircle,
  Send,
  X,
  Globe,
  Bell,
  Clock,
  Sliders
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Datasets from './components/Datasets';
import Analyses from './components/Analyses';
import Predictions from './components/Predictions';
import Reports from './components/Reports';
import Parameters from './components/Parameters';
import PreferencesPage from './components/PreferencesPage';

const translations = {
  fr: {
    title: "Plateforme d'Analyse de données",
    dashboard: "Dashboard",
    datasets: "Datasets",
    analyses: "Analyses",
    predictions: "Prédictions",
    reports: "Rapports",
    preferences: "Préférences",
    parameters: "Paramètres",
    chatHelp: "Puis-je vous aider ?",
    send: "Envoyer",
    typeMessage: "Tapez votre message...",
    generalPrefs: "Préférences Générales",
    language: "Langue",
    timezone: "Fuseau horaire",
    notifications: "Notifications"
  },
  en: {
    title: "Data Analysis Platform",
    dashboard: "Dashboard",
    datasets: "Datasets",
    analyses: "Analyses",
    predictions: "Predictions",
    reports: "Reports",
    preferences: "Preferences",
    parameters: "Settings",
    chatHelp: "Can I help you?",
    send: "Send",
    typeMessage: "Type your message...",
    generalPrefs: "General Preferences",
    language: "Language",
    timezone: "Timezone",
    notifications: "Notifications"
  }
};

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'bot', message: string}>>([]);
  const [currentLang, setCurrentLang] = useState('fr');

  const t = (key: string) => translations[currentLang as keyof typeof translations][key] || key;

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const menuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: BarChart3 },
    { id: 'datasets', label: t('datasets'), icon: Database },
    { id: 'analyses', label: t('analyses'), icon: TrendingUp },
    { id: 'predictions', label: t('predictions'), icon: Brain },
    { id: 'reports', label: t('reports'), icon: FileText },
    { id: 'preferences', label: t('preferences'), icon: Sliders },
    { id: 'parameters', label: t('parameters'), icon: Settings },
  ];

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      setChatHistory(prev => [...prev, { type: 'user', message: chatMessage }]);
      
      // Simulate bot response
      setTimeout(() => {
        setChatHistory(prev => [...prev, { 
          type: 'bot', 
          message: 'Merci pour votre message. Comment puis-je vous aider avec vos données ?' 
        }]);
      }, 1000);
      
      setChatMessage('');
    }
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard isDarkMode={isDarkMode} />;
      case 'datasets':
        return <Datasets isDarkMode={isDarkMode} />;
      case 'analyses':
        return <Analyses isDarkMode={isDarkMode} />;
      case 'predictions':
        return <Predictions isDarkMode={isDarkMode} />;
      case 'reports':
        return <Reports isDarkMode={isDarkMode} />;
      case 'preferences':
        return <PreferencesPage isDarkMode={isDarkMode} currentLang={currentLang} setCurrentLang={setCurrentLang} />;
      case 'parameters':
        return <Parameters isDarkMode={isDarkMode} />;
      default:
        return <Dashboard isDarkMode={isDarkMode} />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`${
        isDarkMode ? 'bg-[#002B5C]' : 'bg-blue-600'
      } text-white px-6 py-4 shadow-lg`}>
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">{t('title')}</h1>
          
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center gap-2">
              <Globe size={18} />
              <select 
                value={currentLang}
                onChange={(e) => setCurrentLang(e.target.value)}
                className="bg-transparent border border-white/20 rounded px-2 py-1 text-sm"
              >
                <option value="fr" className="text-gray-900">FR</option>
                <option value="en" className="text-gray-900">EN</option>
              </select>
            </div>
            
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className={`w-64 min-h-screen ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <div className="p-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                    activeTab === item.id
                      ? isDarkMode 
                        ? 'bg-[#002B5C] text-white' 
                        : 'bg-blue-100 text-blue-700'
                      : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderActiveComponent()}
        </main>
      </div>

      {/* Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        {isChatOpen && (
          <div className={`mb-4 w-64 h-72 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } rounded-lg shadow-xl border ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            {/* Chat Header */}
            <div className={`flex justify-between items-center p-3 border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <span className="text-sm font-medium">{t('chatHelp')}</span>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            </div>
            
            {/* Chat Messages */}
            <div className="h-40 overflow-y-auto p-3 space-y-2">
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`text-xs p-2 rounded max-w-[80%] ${
                    msg.type === 'user'
                      ? 'bg-blue-500 text-white ml-auto'
                      : isDarkMode
                        ? 'bg-gray-700 text-gray-200'
                        : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.message}
                </div>
              ))}
            </div>
            
            {/* Chat Input */}
            <div className={`p-3 border-t ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={t('typeMessage')}
                  className={`flex-1 px-2 py-1 text-xs rounded border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                />
                <button
                  onClick={handleSendMessage}
                  className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                >
                  <Send size={12} />
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Chat Toggle Button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-10 h-10 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
        >
          <MessageCircle size={18} />
        </button>
      </div>
    </div>
  );
}

export default App;