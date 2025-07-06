import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, Sparkles, Brain, Loader, 
  FileText, TrendingUp, AlertCircle, 
  BarChart3, Calculator, HelpCircle,
  CheckCircle, XCircle, Clock
} from 'lucide-react';
import { useStore } from '../store';
import { useTranslation } from '../hooks/useTranslation';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  intent?: string;
  type?: string;
  data?: any;
  loading?: boolean;
}

interface Suggestion {
  text: string;
  query: string;
}

export const CoPilotIA: React.FC = () => {
  const { darkMode, selectedSector } = useStore();
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    role: 'assistant',
    content: t('copilot.greeting'),
    timestamp: new Date()
  }]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadSuggestions();
  }, [selectedSector]);

  const loadSuggestions = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/copilot/suggestions?sector=${selectedSector}`);
      const data = await response.json();
      const allQueries = data.suggestions.flatMap((cat: any) => 
        cat.queries.map((q: string) => ({ text: q, query: q }))
      );
      setSuggestions(allQueries.slice(0, 3));
    } catch (error) {
      console.error('Erreur chargement suggestions:', error);
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    const loadingMessage: Message = {
      id: Date.now().toString() + '-loading',
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      loading: true
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const response = await fetch('http://localhost:8000/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: message,
          context: {
            sector: selectedSector,
            darkMode
          }
        })
      });

      const data = await response.json();
      setMessages(prev => prev.filter(m => m.id !== loadingMessage.id));

      const assistantMessage: Message = {
        id: Date.now().toString() + '-response',
        role: 'assistant',
        content: formatResponse(data.response),
        timestamp: new Date(),
        intent: data.intent,
        type: data.response?.type,
        data: data.response
      };
      setMessages(prev => [...prev, assistantMessage]);

      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
      }

    } catch (error) {
      console.error('Erreur envoi message:', error);
      setMessages(prev => prev.filter(m => m.id !== loadingMessage.id));
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        role: 'assistant',
        content: 'Désolé, une erreur s\'est produite. Veuillez réessayer.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatResponse = (response: any): string => {
    if (!response) {
      return 'Erreur: Réponse vide du serveur';
    }
    switch (response.type) {
      case 'calculation':
        return response.explanation || `${response.metric}: ${response.value}${response.unit}`;
      case 'explanation':
        return response.description || response.message;
      case 'report_generation':
        return `Rapport ${response.report_type} prêt à générer. Temps estimé: ${response.estimated_time}`;
      case 'dashboard_config':
        return `Dashboard "${response.name}" configuré avec ${response.widgets.length} widgets`;
      case 'trend_analysis':
        return response.insights?.map((i: any) => i.message).join('\n') || 'Analyse en cours';
      case 'anomaly_detection':
        return `${response.anomalies_found} anomalie(s) détectée(s). ${response.details?.[0]?.description || ''}`;
      default:
        return response.message || 'Réponse reçue';
    }
  };

  const renderMessageContent = (message: Message) => {
    if (message.loading) {
      return (
        <div className="flex items-center space-x-2">
          <Loader className="h-4 w-4 animate-spin" />
          <span className="text-sm">Analyse en cours...</span>
        </div>
      );
    }

    if (message.data && message.type) {
      switch (message.type) {
        case 'calculation':
          return (
            <div className="space-y-2">
              <p className="text-sm">{message.content}</p>
              {message.data.visualization && (
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-indigo-600">
                      {message.data.value}{message.data.unit}
                    </span>
                    {message.data.status === 'healthy' ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <AlertCircle className="h-6 w-6 text-yellow-500" />
                    )}
                  </div>
                  <div className="mt-2">
                    <div className="text-xs text-gray-500">
                      Seuil: {message.data.threshold}{message.data.unit}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );

        case 'report_generation':
          return (
            <div className="space-y-3">
              <p className="text-sm">{message.content}</p>
              <div className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    <span className="font-medium">Rapport {message.data.report_type}</span>
                  </div>
                  <span className="text-sm text-gray-500">{message.data.estimated_time}</span>
                </div>
                <div className="space-y-1">
                  {message.data.sections.map((section: string, idx: number) => (
                    <div key={idx} className="text-sm text-gray-600 flex items-center space-x-2">
                      <div className="w-1 h-1 bg-gray-400 rounded-full" />
                      <span>{section}</span>
                    </div>
                  ))}
                </div>
                <button className="mt-3 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Générer le rapport
                </button>
              </div>
            </div>
          );

        case 'dashboard_config':
          return (
            <div className="space-y-3">
              <p className="text-sm">{message.content}</p>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {message.data.widgets.slice(0, 4).map((widget: any, idx: number) => (
                    <div key={idx} className={`p-2 rounded text-center text-xs
                      ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                      {widget.type === 'kpi_card' ? <Calculator className="h-4 w-4 mx-auto mb-1" /> : 
                       widget.type === 'line_chart' ? <TrendingUp className="h-4 w-4 mx-auto mb-1" /> :
                       <BarChart3 className="h-4 w-4 mx-auto mb-1" />}
                      {widget.metric || widget.title}
                    </div>
                  ))}
                </div>
                <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Créer le dashboard
                </button>
              </div>
            </div>
          );

        default:
          return <p className="text-sm whitespace-pre-wrap">{message.content}</p>;
      }
    }

    return <p className="text-sm whitespace-pre-wrap">{message.content}</p>;
  };

  const getIntentIcon = (intent?: string) => {
    switch (intent) {
      case 'calculate_ratio':
        return <Calculator className="h-4 w-4" />;
      case 'generate_report':
        return <FileText className="h-4 w-4" />;
      case 'analyze_trend':
        return <TrendingUp className="h-4 w-4" />;
      case 'explain_metric':
        return <HelpCircle className="h-4 w-4" />;
      case 'detect_anomaly':
        return <AlertCircle className="h-4 w-4" />;
      case 'create_dashboard':
        return <BarChart3 className="h-4 w-4" />;
      default:
        return <Bot className="h-4 w-4" />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-indigo-600 rounded-xl">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Co-Pilot IA Finance & Assurance
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Assistant intelligent spécialisé {selectedSector === 'banking' ? 'Bancaire' : 
                                               selectedSector === 'insurance' ? 'Assurance' : 
                                               'Finance & Assurance'}
            </p>
          </div>
        </div>

        {/* Zone de chat */}
        <div className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex space-x-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                    ${message.role === 'user' 
                      ? 'bg-indigo-600 text-white' 
                      : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                    {message.role === 'user' ? 'U' : getIntentIcon(message.intent)}
                  </div>
                  
                  {/* Message */}
                  <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                    {message.intent && message.role === 'assistant' && (
                      <span className="text-xs text-indigo-600 mb-1 inline-block">
                        {message.intent.replace(/_/g, ' ')}
                      </span>
                    )}
                    <div className={`inline-block px-4 py-2 rounded-lg
                      ${message.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-900'}`}>
                      {renderMessageContent(message)}
                    </div>
                    <div className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className={`px-6 py-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Suggestions
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(suggestion.query)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors
                      ${darkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {suggestion.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Zone de saisie */}
          <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(inputMessage); }} 
                  className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={t('copilot.placeholder')}
                disabled={isLoading}
                className={`flex-1 px-4 py-2 rounded-lg border transition-colors
                  ${darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className={`px-4 py-2 rounded-lg font-medium transition-all
                  ${isLoading || !inputMessage.trim()
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
              >
                {isLoading ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Capacités */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: Calculator,
              title: 'Calculs Intelligents',
              description: 'Ratios réglementaires, KPIs sectoriels'
            },
            {
              icon: FileText,
              title: 'Rapports Automatiques',
              description: 'COREP, FINREP, Solvency II, Dashboards'
            },
            {
              icon: Brain,
              title: 'Analyses Prédictives',
              description: 'Tendances, anomalies, recommandations'
            }
          ].map((capability, idx) => (
            <div key={idx} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <capability.icon className="h-8 w-8 text-indigo-600 mb-2" />
              <h3 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {capability.title}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {capability.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};