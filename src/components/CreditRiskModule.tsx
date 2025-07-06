import React, { useState, useEffect } from 'react';
import { 
  Calculator, TrendingUp, AlertTriangle, FileText, 
  Upload, BarChart3, Shield, Activity, Download,
  ChevronRight, AlertCircle, CheckCircle, Info
} from 'lucide-react';
import { useStore } from '../store';
import { useTranslation } from '../hooks/useTranslation';

interface RiskMetrics {
  pd: number;
  lgd: number;
  ead: number;
  ecl_12_months: number;
  ecl_lifetime: number;
  ifrs9_stage: number;
}

interface StressTestResult {
  scenario: string;
  total_ead: number;
  total_ecl: number;
  ecl_rate: number;
  capital_impact: number;
}

type TabType = 'calculator' | 'portfolio' | 'stress-test' | 'migration';

export const CreditRiskModule: React.FC = () => {
  const { darkMode, selectedSector } = useStore();
  const { t } = useTranslation();
  
  // States
  const [activeTab, setActiveTab] = useState<TabType>('calculator');
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Calculator states
  const [rating, setRating] = useState('BBB');
  const [exposureAmount, setExposureAmount] = useState(1000000);
  const [drawnAmount, setDrawnAmount] = useState(800000);
  const [undrawnAmount, setUndrawnAmount] = useState(200000);
  const [collateralValue, setCollateralValue] = useState(500000);
  const [collateralType, setCollateralType] = useState('real_estate');
  const [scenario, setScenario] = useState('baseline');
  const [calculationResult, setCalculationResult] = useState<any>(null);
  
  // Portfolio states
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [stressTestResults, setStressTestResults] = useState<any>(null);
  
  const ratings = ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'CC', 'C', 'D'];
  const scenarios = ['baseline', 'adverse', 'severe'];
  const collateralTypes = [
    { value: 'unsecured', label: 'Non garanti' },
    { value: 'real_estate', label: 'Immobilier' },
    { value: 'financial', label: 'Financier' },
    { value: 'guarantee', label: 'Garantie' },
    { value: 'other', label: 'Autre' }
  ];

  // Calculer l'évaluation complète
  const calculateFullAssessment = async () => {
    setIsCalculating(true);
    try {
      const response = await fetch('http://localhost:8000/api/credit-risk/calculate/full-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exposure_id: 'EXP001',
          borrower_id: 'BRW001',
          exposure_amount: exposureAmount,
          drawn_amount: drawnAmount,
          undrawn_amount: undrawnAmount,
          rating: rating,
          collateral_value: collateralValue,
          collateral_type: collateralType,
          sector: selectedSector,
          country: 'FR',
          maturity_months: 12
        })
      });
      
      const data = await response.json();
      setCalculationResult(data);
    } catch (error) {
      console.error('Erreur calcul:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  // Exécuter un stress test
  const runStressTest = async () => {
    if (portfolio.length === 0) return;
    
    setIsCalculating(true);
    try {
      const response = await fetch('http://localhost:8000/api/credit-risk/stress-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portfolio: portfolio,
          scenarios: ['baseline', 'adverse', 'severe']
        })
      });
      
      const data = await response.json();
      setStressTestResults(data);
    } catch (error) {
      console.error('Erreur stress test:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  // Upload portfolio
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/credit-risk/portfolio/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      // Simuler le chargement du portfolio
      setPortfolio([
        {
          exposure_id: 'EXP001',
          rating: 'BBB',
          exposure_amount: 1000000,
          drawn_amount: 800000,
          sector: 'retail'
        },
        {
          exposure_id: 'EXP002',
          rating: 'BB',
          exposure_amount: 500000,
          drawn_amount: 400000,
          sector: 'corporate'
        }
      ]);
    } catch (error) {
      console.error('Erreur upload:', error);
    }
  };

  const getRatingColor = (rating: string) => {
    const index = ratings.indexOf(rating);
    if (index <= 2) return 'text-green-500';
    if (index <= 4) return 'text-yellow-500';
    if (index <= 6) return 'text-orange-500';
    return 'text-red-500';
  };

  const getStageColor = (stage: number) => {
    switch (stage) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 3: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-red-600 rounded-xl">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Module Credit Risk - IFRS 9
              </h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Calcul PD, LGD, EAD • Stress Tests BCE • Matrices de migration
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-200 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors
                ${activeTab === 'calculator'
                  ? 'bg-white dark:bg-gray-700 text-red-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'}`}
            >
              <Calculator className="h-4 w-4" />
              <span>Calculateur</span>
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors
                ${activeTab === 'portfolio'
                  ? 'bg-white dark:bg-gray-700 text-red-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'}`}
            >
              <FileText className="h-4 w-4" />
              <span>Portefeuille</span>
            </button>
            <button
              onClick={() => setActiveTab('stress-test')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors
                ${activeTab === 'stress-test'
                  ? 'bg-white dark:bg-gray-700 text-red-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'}`}
            >
              <Activity className="h-4 w-4" />
              <span>Stress Test</span>
            </button>
            <button
              onClick={() => setActiveTab('migration')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors
                ${activeTab === 'migration'
                  ? 'bg-white dark:bg-gray-700 text-red-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'}`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>Migration</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'calculator' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inputs */}
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Paramètres de l'exposition
              </h2>

              <div className="space-y-4">
                {/* Rating */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Rating
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {ratings.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                {/* Montants */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Montant exposé (€)
                    </label>
                    <input
                      type="number"
                      value={exposureAmount}
                      onChange={(e) => setExposureAmount(Number(e.target.value))}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Montant tiré (€)
                    </label>
                    <input
                      type="number"
                      value={drawnAmount}
                      onChange={(e) => setDrawnAmount(Number(e.target.value))}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>

                {/* Garantie */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Valeur garantie (€)
                    </label>
                    <input
                      type="number"
                      value={collateralValue}
                      onChange={(e) => setCollateralValue(Number(e.target.value))}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Type de garantie
                    </label>
                    <select
                      value={collateralType}
                      onChange={(e) => setCollateralType(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      {collateralTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Scénario */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Scénario
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {scenarios.map(s => (
                      <button
                        key={s}
                        onClick={() => setScenario(s)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors
                          ${scenario === s
                            ? 'bg-red-600 text-white'
                            : darkMode
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bouton calculer */}
                <button
                  onClick={calculateFullAssessment}
                  disabled={isCalculating}
                  className="w-full py-3 px-4 bg-red-600 text-white rounded-lg font-medium
                    hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCalculating ? 'Calcul en cours...' : 'Calculer l\'évaluation complète'}
                </button>
              </div>
            </div>

            {/* Results */}
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Résultats de l'évaluation
              </h2>

              {calculationResult ? (
                <div className="space-y-4">
                  {/* Métriques principales */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">PD</span>
                        <Info className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="text-2xl font-bold text-red-600">
                        {calculationResult.percentages.pd_percentage}%
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Probability of Default
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">LGD</span>
                        <Info className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="text-2xl font-bold text-orange-600">
                        {calculationResult.percentages.lgd_percentage}%
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Loss Given Default
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">EAD</span>
                        <Info className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        €{calculationResult.risk_metrics.ead.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Exposure at Default
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">ECL</span>
                        <Info className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="text-2xl font-bold text-purple-600">
                        €{calculationResult.risk_metrics.ecl_lifetime.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Expected Credit Loss
                      </div>
                    </div>
                  </div>

                  {/* Stage IFRS 9 */}
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Stage IFRS 9</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium
                        ${getStageColor(calculationResult.risk_metrics.ifrs9_stage)}`}>
                        Stage {calculationResult.risk_metrics.ifrs9_stage}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      {calculationResult.risk_metrics.ifrs9_stage === 1 && "Exposition performante"}
                      {calculationResult.risk_metrics.ifrs9_stage === 2 && "Augmentation significative du risque"}
                      {calculationResult.risk_metrics.ifrs9_stage === 3 && "Exposition en défaut"}
                    </div>
                  </div>

                  {/* Rating de risque */}
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Rating de risque global</span>
                      <span className={`text-2xl font-bold ${getRatingColor(calculationResult.risk_rating)}`}>
                        {calculationResult.risk_rating}
                      </span>
                    </div>
                  </div>

                  {/* Recommandations */}
                  {calculationResult.recommendations.length > 0 && (
                    <div className={`p-4 rounded-lg border ${
                      darkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                      <h3 className="text-sm font-medium mb-2">Recommandations</h3>
                      <ul className="space-y-1">
                        {calculationResult.recommendations.map((rec: string, idx: number) => (
                          <li key={idx} className="text-sm text-gray-500">
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Configurez les paramètres et cliquez sur "Calculer"</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Gestion du portefeuille
              </h2>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  <Upload className="h-4 w-4" />
                  <span>Importer portfolio</span>
                </div>
              </label>
            </div>

            {portfolio.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <th className="text-left py-3 px-4">ID</th>
                      <th className="text-left py-3 px-4">Rating</th>
                      <th className="text-right py-3 px-4">Exposition</th>
                      <th className="text-right py-3 px-4">Tiré</th>
                      <th className="text-left py-3 px-4">Secteur</th>
                      <th className="text-center py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.map((item, idx) => (
                      <tr key={idx} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <td className="py-3 px-4">{item.exposure_id}</td>
                        <td className={`py-3 px-4 font-medium ${getRatingColor(item.rating)}`}>
                          {item.rating}
                        </td>
                        <td className="text-right py-3 px-4">
                          €{item.exposure_amount.toLocaleString()}
                        </td>
                        <td className="text-right py-3 px-4">
                          €{item.drawn_amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">{item.sector}</td>
                        <td className="text-center py-3 px-4">
                          <button className="text-red-600 hover:text-red-700">
                            <Calculator className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={runStressTest}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Exécuter stress test sur le portefeuille
                  </button>
                </div>
              </div>
            ) : (
              <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun portefeuille chargé</p>
                <p className="text-sm mt-2">Importez un fichier CSV ou Excel pour commencer</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'stress-test' && (
          <div className="space-y-6">
            {stressTestResults ? (
              <>
                {/* Résumé */}
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Résultats du stress test
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(stressTestResults.results).map(([scenario, data]: [string, any]) => (
                      <div key={scenario} className={`p-4 rounded-lg border ${
                        darkMode ? 'border-gray-700' : 'border-gray-200'
                      }`}>
                        <h3 className="font-medium mb-3 capitalize">{scenario}</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">EAD Total</span>
                            <span className="font-medium">€{data.total_ead.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">ECL Total</span>
                            <span className="font-medium text-red-600">€{data.total_ecl.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Taux ECL</span>
                            <span className="font-medium">{data.ecl_rate}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comparaison */}
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Analyse comparative
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <span className="text-sm text-gray-500">Augmentation ECL (Adverse)</span>
                      <div className="text-2xl font-bold text-orange-600 mt-1">
                        +{stressTestResults.comparison.ecl_increase_adverse}%
                      </div>
                    </div>
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <span className="text-sm text-gray-500">Augmentation ECL (Sévère)</span>
                      <div className="text-2xl font-bold text-red-600 mt-1">
                        +{stressTestResults.comparison.ecl_increase_severe}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommandations */}
                {stressTestResults.recommendations.length > 0 && (
                  <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                    <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Recommandations
                    </h3>
                    <ul className="space-y-2">
                      {stressTestResults.recommendations.map((rec: string, idx: number) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <ChevronRight className="h-4 w-4 text-red-600 mt-0.5" />
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun stress test exécuté</p>
                  <p className="text-sm mt-2">Chargez un portefeuille pour lancer un stress test</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'migration' && (
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h2 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Matrice de migration des ratings
            </h2>
            
            <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Fonctionnalité en cours de développement</p>
              <p className="text-sm mt-2">La matrice de migration sera disponible prochainement</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};