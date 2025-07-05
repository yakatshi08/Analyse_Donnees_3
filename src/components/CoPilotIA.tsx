// Fichier: C:\PROJETS-DEVELOPPEMENT\Analyse_Donnees_CLEAN\project\src\components\CoPilotIA.tsx

import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, Send, Sparkles, TrendingUp, AlertCircle, 
  BarChart3, Shield, Building2, FileText, Loader2,
  Copy, Download, RefreshCw, Mic, MicOff
} from 'lucide-react';
import { useFinanceStore } from '../store';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'chart' | 'table' | 'alert';
  data?: any;
}

interface Suggestion {
  icon: React.ReactNode;
  text: string;
  query: string;
  category: 'banking' | 'insurance' | 'risk' | 'general';
}

const CoPilotIA: React.FC = () => {
  const { isDarkMode } = useFinanceStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [selectedContext, setSelectedContext] = useState<'banking' | 'insurance' | 'all'>('all');

  // Suggestions contextuelles
  const suggestions: Suggestion[] = [
    {
      icon: <Building2 className="w-4 h-4" />,
      text: "Calcule mon ratio CET1",
      query: "Calcule mon ratio CET1 pour le dernier trimestre",
      category: 'banking'
    },
    {
      icon: <Shield className="w-4 h-4" />,
      text: "Analyse Solvency II",
      query: "Montre l'évolution de mon ratio SCR sur 12 mois",
      category: 'insurance'
    },
    {
      icon: <TrendingUp className="w-4 h-4" />,
      text: "Prévisions de liquidité",
      query: "Génère les prévisions de liquidité pour les 3 prochains mois",
      category: 'banking'
    },
    {
      icon: <AlertCircle className="w-4 h-4" />,
      text: "Détection d'anomalies",
      query: "Y a-t-il des anomalies dans les transactions de cette semaine?",
      category: 'risk'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Message de bienvenue
    const welcomeMessage: Message = {
      id: '1',
      role: 'assistant',
      content: `Bonjour ! Je suis votre co-pilot IA spécialisé en finance et assurance. 
      Je peux vous aider avec :
      • Calculs de ratios bancaires (CET1, LCR, NSFR)
      • Analyses Solvency II (SCR, MCR)
      • Génération de rapports réglementaires
      • Détection d'anomalies et prévisions
      
      Comment puis-je vous aider aujourd'hui ?`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulation d'une réponse IA
    setTimeout(async () => {
      const response = await processQuery(userMessage.content);
      setMessages(prev => [...prev, response]);
      setIsLoading(false);
    }, 1500);
  };

  const processQuery = async (query: string): Promise<Message> => {
    const lowerQuery = query.toLowerCase();
    
    // Logique de traitement selon le type de requête
    if (lowerQuery.includes('ratio cet1') || lowerQuery.includes('tier 1')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: `D'après les dernières données disponibles :

**Ratio CET1 (Common Equity Tier 1)**
- Ratio actuel : 14.8%
- Minimum réglementaire : 10.5%
- Marge de sécurité : +4.3%

📊 Évolution sur 12 mois :
- Q1 2024 : 13.2%
- Q2 2024 : 13.8%
- Q3 2024 : 14.5%
- Q4 2024 : 14.8%

✅ **Statut** : Conforme aux exigences Bâle III
💡 **Recommandation** : Maintenir le ratio au-dessus de 14% pour conserver une marge confortable.`,
        timestamp: new Date(),
        type: 'text'
      };
    }
    
    if (lowerQuery.includes('solvency') || lowerQuery.includes('scr')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: `**Analyse Solvency II - Ratios de solvabilité**

📊 **SCR (Solvency Capital Requirement)**
- Ratio de couverture SCR : 168%
- Minimum réglementaire : 100%
- Excédent : 780M€

📈 **MCR (Minimum Capital Requirement)**
- Ratio de couverture MCR : 412%
- Minimum réglementaire : 100%

**Décomposition du SCR :**
- Risque de marché : 45%
- Risque de souscription : 35%
- Risque de contrepartie : 15%
- Risque opérationnel : 5%

✅ Position de solvabilité solide avec des marges confortables`,
        timestamp: new Date(),
        type: 'chart'
      };
    }

    if (lowerQuery.includes('rapport') || lowerQuery.includes('génère')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Je vais générer le rapport demandé. Voici les options disponibles :

1. **Rapport COREP** - Reporting prudentiel bancaire
2. **Rapport QRT Solvency II** - Reporting assurance
3. **Stress Test BCE** - Tests de résistance
4. **Rapport IFRS 9** - Provisions pour pertes

Quel type de rapport souhaitez-vous générer ?`,
        timestamp: new Date(),
        type: 'text'
      };
    }

    // Réponse par défaut
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: `J'ai bien compris votre demande concernant "${query}". 
      
Je suis en train d'analyser les données pertinentes. En attendant, voici quelques insights rapides :

- Les indicateurs clés sont dans les normes
- Aucune anomalie majeure détectée
- Les tendances sont globalement positives

Souhaitez-vous que je génère un rapport détaillé ou que j'approfondisse un aspect particulier ?`,
      timestamp: new Date()
    };
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setInput(suggestion.query);
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = 'fr-FR';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognition.start();
    } else {
      alert('La reconnaissance vocale n\'est pas supportée par votre navigateur');
    }
  };

  const exportConversation = () => {
    const content = messages.map(m => 
      `[${m.timestamp.toLocaleString()}] ${m.role === 'user' ? 'Vous' : 'Assistant'}: ${m.content}`
    ).join('\n\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-copilot-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  return (
    <div className={`flex flex-col h-full ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-6 border-b ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Co-pilot IA Finance & Assurance</h1>
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>Assistant intelligent pour vos analyses et rapports</p>
          </div>
        </div>
        
        {/* Context Selector */}
        <div className="flex items-center space-x-4">
          <select
            value={selectedContext}
            onChange={(e) => setSelectedContext(e.target.value as any)}
            className={`px-4 py-2 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">Tous les modules</option>
            <option value="banking">Banking</option>
            <option value="insurance">Insurance</option>
          </select>
          
          <button
            onClick={exportConversation}
            className={`p-2 rounded-lg ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
            title="Exporter la conversation"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Suggestions rapides */}
      <div className={`px-6 py-4 border-b ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <p className={`text-sm font-medium mb-3 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>Suggestions rapides :</p>
        <div className="flex flex-wrap gap-2">
          {suggestions
            .filter(s => selectedContext === 'all' || s.category === selectedContext)
            .map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {suggestion.icon}
                <span className="text-sm">{suggestion.text}</span>
              </button>
            ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-3xl rounded-lg p-4 ${
              message.role === 'user'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                : isDarkMode 
                  ? 'bg-gray-800 text-gray-100 border border-gray-700' 
                  : 'bg-white text-gray-900 border border-gray-200'
            }`}>
              <div className="flex items-start space-x-3">
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-indigo-500" />
                  </div>
                )}
                <div className="flex-1">
                  <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
                  <div className={`flex items-center justify-between mt-3 text-xs ${
                    message.role === 'user' 
                      ? 'text-indigo-200' 
                      : isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    <span>{message.timestamp.toLocaleTimeString()}</span>
                    {message.role === 'assistant' && (
                      <button
                        onClick={() => navigator.clipboard.writeText(message.content)}
                        className="hover:text-indigo-500 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className={`rounded-lg p-4 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
            }`}>
              <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={`p-6 border-t ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleVoiceInput}
            className={`p-3 rounded-lg transition-all ${
              isListening
                ? 'bg-red-500 text-white'
                : isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Posez votre question en langage naturel..."
            className={`flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
          
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`p-3 rounded-lg transition-all ${
              input.trim() && !isLoading
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoPilotIA;