import React, { useEffect } from 'react';
import { PIBicarsHeader } from './components/PIBicarsHeader';
import { ModuleNavigation } from './components/ModuleNavigation';
import { Dashboard } from './components/Dashboard';
import { DataImport } from './components/DataImport';
import { BankingCore } from './components/BankingCore';
import { InsuranceCore } from './components/InsuranceCore';
import { CoPilotIA } from './components/CoPilotIA';
import { CreditRiskModule } from './components/CreditRiskModule';
import { AnalyticsMLModule } from './components/AnalyticsMLModule';
import IntelligentHomepage from './pages/IntelligentHomepage';
import ActuarialAnalytics from './components/insurance/ActuarialAnalytics';
import ClaimsUnderwriting from './components/insurance/ClaimsUnderwriting'; // ✅ AJOUT ICI
import LiquidityALM from './components/LiquidityALM'; // ✅ AJOUT IMPORT
import MarketRisk from './components/MarketRisk'; // AJOUT IMPORT MARKET RISK
import { useStore } from './store';
import { useTranslation } from './hooks/useTranslation';

function App() {
  const { 
    darkMode, 
    activeModule, 
    setActiveModule, 
    onboardingCompleted,
    importedFileData 
  } = useStore();
  const { t } = useTranslation();

  // Redirection vers la page d'accueil si onboarding non complété
  useEffect(() => {
    if (!onboardingCompleted && activeModule !== 'home') {
      setActiveModule('home');
    }
  }, [onboardingCompleted, activeModule, setActiveModule]);

  // AJOUT: Effet temporaire pour forcer le module actuariel
  useEffect(() => {
    setActiveModule('actuarial');
  }, [setActiveModule]);

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'home':
        return <IntelligentHomepage />;
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
      case 'analytics-ml':
        return <AnalyticsMLModule />;
      case 'claims-underwriting':
        return <ClaimsUnderwriting />; // ✅ AJOUT DU MODULE ICI
      case 'liquidity-alm': // ✅ AJOUT CASE
        return <LiquidityALM />;
      case 'market-risk': // AJOUT CASE MARKET RISK
        return <MarketRisk />;
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
        return <ActuarialAnalytics />;
      default:
        return !onboardingCompleted ? <IntelligentHomepage /> : <Dashboard />;
    }
  };

  const showNavigation = activeModule !== 'home' || onboardingCompleted;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {showNavigation && (
        <>
          <PIBicarsHeader />
          <ModuleNavigation />
        </>
      )}
      
      <main className="flex-1">
        {activeModule === 'home' && !onboardingCompleted ? (
          renderActiveModule()
        ) : (
          <div className={activeModule === 'actuarial' ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}>
            {renderActiveModule()}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;