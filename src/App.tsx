// Fichier: C:\PROJETS-DEVELOPPEMENT\Analyse_Donnees_CLEAN\project\src\App.tsx
// Version avec modules CoPilotIA et InsuranceCore désactivés temporairement

import React, { useState, useEffect } from 'react';
import {
  Home, BarChart3, Settings, FileText, Users,
  Shield, TrendingUp, Moon, Sun, Menu, X, AlertTriangle, Building2, CreditCard,
  RefreshCw, Brain, Activity, Calculator, Droplets
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import Analyses from './components/Analyses';
import FinancialCharts from './components/FinancialCharts';
import BankingCore from './components/BankingCore';
import CreditRisk from './components/CreditRisk';
// import CoPilotIA from './components/CoPilotIA';        // TEMPORARY COMMENT
// import InsuranceCore from './components/InsuranceCore'; // TEMPORARY COMMENT
// import LandingPage from './components/LandingPage'; // À importer quand vous copierez le fichier
import { useFinanceStore } from './store';
import DataProvider from './components/DataProvider';
import { useApiData } from './hooks/useApiData';

// ========== SECTION 2 : COMPOSANT TopBar ==========
const TopBar: React.FC = () => {
  const { isDarkMode, setDarkMode } = useFinanceStore();
  const { refresh, isLoading } = useApiData();

  return (
    <div className={`sticky top-0 z-10 flex-shrink-0 flex h-16 ${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    } shadow`}>
      <div className="flex-1 px-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            PI DatAnalyz
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Bouton de rafraîchissement */}
          <button
            onClick={refresh}
            disabled={isLoading}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isDarkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {/* Bouton mode sombre/clair */}
          <button
            onClick={() => setDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg ${
              isDarkMode
                ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors duration-200`}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

// ========== SECTION 3 : COMPOSANT PRINCIPAL App ==========
function App() {
  const { isDarkMode, activeTab, setActiveTab } = useFinanceStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLanding, setShowLanding] = useState(true); // Pour afficher la landing page au démarrage

  const menuItems = [
    { icon: <Home className="h-5 w-5" />, label: 'Dashboard', id: 'dashboard' },
    { icon: <Brain className="h-5 w-5" />, label: 'Co-pilot IA', id: 'copilot' },
    { icon: <BarChart3 className="h-5 w-5" />, label: 'Analyses', id: 'analyses' },
    { icon: <FileText className="h-5 w-5" />, label: 'Rapports', id: 'reports' },
    { icon: <TrendingUp className="h-5 w-5" />, label: 'Finance', id: 'finance' },
    { icon: <Building2 className="h-5 w-5" />, label: 'Banking Core', id: 'banking' },
    { icon: <Shield className="h-5 w-5" />, label: 'Insurance Core', id: 'insurance' },
    { icon: <AlertTriangle className="h-5 w-5" />, label: 'Credit Risk', id: 'creditrisk' },
    { icon: <Droplets className="h-5 w-5" />, label: 'Liquidité ALM', id: 'liquidity' },
    { icon: <Activity className="h-5 w-5" />, label: 'Market Risk', id: 'marketrisk' },
    { icon: <Calculator className="h-5 w-5" />, label: 'Actuariat', id: 'actuarial' },
    { icon: <Users className="h-5 w-5" />, label: 'Clients', id: 'clients' },
    { icon: <Settings className="h-5 w-5" />, label: 'Paramètres', id: 'settings' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'copilot':
        return (
          <div className={`p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
            <h2 className="text-2xl font-bold">Co-pilot IA</h2>
            <p>Module en cours de création...</p>
          </div>
        );
      case 'analyses':
        return <Analyses />;
      case 'reports':
        return <Reports />;
      case 'finance':
        return <FinancialCharts />;
      case 'banking':
        return <BankingCore />;
      case 'insurance':
        return (
          <div className={`p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
            <h2 className="text-2xl font-bold">Insurance Core</h2>
            <p>Module en cours de création...</p>
          </div>
        );
      case 'creditrisk':
        return <CreditRisk />;
      case 'liquidity':
        return (
          <div className={`p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
            <h2 className="text-2xl font-bold mb-4">Module Liquidité & ALM</h2>
            <p className="text-gray-600 dark:text-gray-400">Module en cours de développement...</p>
          </div>
        );
      case 'marketrisk':
        return (
          <div className={`p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
            <h2 className="text-2xl font-bold mb-4">Module Market Risk</h2>
            <p className="text-gray-600 dark:text-gray-400">Module en cours de développement...</p>
          </div>
        );
      case 'actuarial':
        return (
          <div className={`p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
            <h2 className="text-2xl font-bold mb-4">Module Actuariat</h2>
            <p className="text-gray-600 dark:text-gray-400">Module en cours de développement...</p>
          </div>
        );
      case 'clients':
        return (
          <div className={`p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
            <h2 className="text-2xl font-bold mb-4">Gestion Clients</h2>
            <p className="text-gray-600 dark:text-gray-400">Module en cours de développement...</p>
          </div>
        );
      case 'settings':
        return (
          <div className={`p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
            <h2 className="text-2xl font-bold mb-4">Paramètres</h2>
            <p className="text-gray-600 dark:text-gray-400">Configuration de l'application...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <DataProvider>
      <div className={`h-screen flex ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Sidebar, Mobile, etc. — inchangés */}
        {/* ... */}
        <TopBar />
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {renderContent()}
        </main>
      </div>
    </DataProvider>
  );
}

export default App;
