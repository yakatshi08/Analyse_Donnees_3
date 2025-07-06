import React from 'react';
import { PIBicarsHeader } from './components/PIBicarsHeader';
import { ModuleNavigation } from './components/ModuleNavigation';
import { Dashboard } from './components/Dashboard';
import { DataImport } from './components/DataImport';
import { BankingCore } from './components/BankingCore';
import { InsuranceCore } from './components/InsuranceCore';
import { CoPilotIA } from './components/CoPilotIA';
import { useStore } from './store';
import { useTranslation } from './hooks/useTranslation';
import { CreditRiskModule } from './components/CreditRiskModule';
import { AnalyticsMLModule } from './components/AnalyticsMLModule'; // AJOUT

function App() {
  const { darkMode, activeModule } = useStore();
  const { t } = useTranslation();

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      
      case 'import':
        return <DataImport />;
      
      case 'banking-core':
        return <BankingCore />;
      
      case 'insurance-core':
        return <InsuranceCore />;
      
      case 'co-pilot':
        return <CoPilotIA />;
      
      case 'credit-risk':
        return <CreditRiskModule />;
      
      // AJOUT: Nouveau module Analytics ML
      case 'analytics-ml':
        return <AnalyticsMLModule />;
      
      case 'risk':
        return (
          <div className={`flex items-center justify-center h-96 
            ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Risk Management</h2>
              <p className="text-gray-500">Module en cours de développement</p>
              <p className="text-sm mt-2">Stress tests, VaR/CVaR, Monte Carlo</p>
            </div>
          </div>
        );
      
      case 'reports':
        return (
          <div className={`flex items-center justify-center h-96 
            ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Reports</h2>
              <p className="text-gray-500">Module en cours de développement</p>
              <p className="text-sm mt-2">COREP, FINREP, Solvency II QRT</p>
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className={`flex items-center justify-center h-96 
            ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Settings</h2>
              <p className="text-gray-500">Configuration système</p>
              <p className="text-sm mt-2">Connecteurs API, Sécurité, Préférences</p>
            </div>
          </div>
        );
      
      case 'actuarial':
        return (
          <div className={`flex items-center justify-center h-96 
            ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Actuarial Analytics</h2>
              <p className="text-gray-500">Réserves techniques, Triangles de développement</p>
              <p className="text-sm mt-2">Chain Ladder, Bornhuetter-Ferguson</p>
            </div>
          </div>
        );
      
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header en haut */}
      <PIBicarsHeader />
      
      {/* Navigation horizontale en dessous du header */}
      <ModuleNavigation />
      
      {/* Contenu principal */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderActiveModule()}
        </div>
      </main>
    </div>
  );
}

export default App;