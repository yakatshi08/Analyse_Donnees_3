// ========== DÉBUT DU FICHIER App.tsx ==========

import React, { useState } from 'react';
import { 
  Home, BarChart3, Settings, FileText, Users, 
  Shield, TrendingUp, Moon, Sun, Menu, X, AlertTriangle, Building2, CreditCard,
  RefreshCw
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import Analyses from './components/Analyses';
import FinancialCharts from './components/FinancialCharts';
import BankingCore from './components/BankingCore';
import CreditRisk from './components/CreditRisk';
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
      <div className="flex-1 px-4 flex justify-end items-center space-x-3">
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
  );
};

// ========== SECTION 3 : COMPOSANT PRINCIPAL App ==========
function App() {
  const { isDarkMode, activeTab, setActiveTab } = useFinanceStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: <Home className="h-5 w-5" />, label: 'Dashboard', id: 'dashboard' },
    { icon: <BarChart3 className="h-5 w-5" />, label: 'Analyses', id: 'analyses' },
    { icon: <FileText className="h-5 w-5" />, label: 'Rapports', id: 'reports' },
    { icon: <TrendingUp className="h-5 w-5" />, label: 'Finance', id: 'finance' },
    { icon: <AlertTriangle className="h-5 w-5" />, label: 'Risques', id: 'risks' },
    { icon: <Building2 className="h-5 w-5" />, label: 'Banking Core', id: 'banking' },
    { icon: <CreditCard className="h-5 w-5" />, label: 'Credit Risk', id: 'creditrisk' },
    { icon: <Users className="h-5 w-5" />, label: 'Clients', id: 'clients' },
    { icon: <Shield className="h-5 w-5" />, label: 'Sécurité', id: 'security' },
    { icon: <Settings className="h-5 w-5" />, label: 'Paramètres', id: 'settings' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'analyses':
        return <Analyses isDarkMode={isDarkMode} />;
      case 'reports':
        return <Reports isDarkMode={isDarkMode} />;
      case 'finance':
        return <FinancialCharts />;
      case 'risks':
        return <div className={`text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Gestion des Risques</div>;
      case 'banking':
        return <BankingCore />;
      case 'creditrisk':
        return <CreditRisk />;
      case 'clients':
        return <div className={`text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Gestion des Clients</div>;
      case 'security':
        return <div className={`text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Sécurité et Conformité</div>;
      case 'settings':
        return <div className={`text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Paramètres</div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <DataProvider>
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        {/* Sidebar - Desktop */}
        <div className={`hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-xl`}>
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                FinTech Analytics
              </h1>
            </div>
            <nav className="mt-8 flex-1 px-2 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    activeTab === item.id
                      ? isDarkMode
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-200 text-gray-900'
                      : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile header */}
        <div className={`md:hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              FinTech Analytics
            </h1>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-md ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <nav className="px-2 pt-2 pb-3 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                    activeTab === item.id
                      ? isDarkMode
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-200 text-gray-900'
                      : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Main content */}
        <div className="md:pl-64 flex flex-col flex-1">
          {/* Top bar */}
          <TopBar />

          {/* Page content */}
          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {renderContent()}
              </div>
            </div>
          </main>
        </div>
      </div>
    </DataProvider>
  );
}

export default App;

// ========== FIN DU FICHIER App.tsx ==========
