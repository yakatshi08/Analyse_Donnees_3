import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, Target, UserPlus, 
  DollarSign, Percent, Activity, Shield,
  AlertCircle, CheckCircle, TrendingDown, Settings
} from 'lucide-react';
import { useStore } from '../store';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, ResponsiveContainer
} from 'recharts';
import { CreditRiskDashboard } from '../modules/banking/credit-risk';

// Types pour les KPIs
interface KPI {
  id: string;
  name: string;
  value: string;
  change?: string;
  status?: 'up' | 'down' | 'stable';
  icon: React.ElementType;
  color: string;
  sector?: 'banking' | 'insurance' | 'all';
  description?: string;
  threshold?: string;
}

export const Dashboard: React.FC = () => {
  const { darkMode, selectedSector, userProfile } = useStore();
  const [showCreditRisk, setShowCreditRisk] = useState(false);
  const [importedData, setImportedData] = useState<any[]>([]);
  const [creditRiskData, setCreditRiskData] = useState<any>(null);
  const [pendingDataLoaded, setPendingDataLoaded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // DEBUG: Vérifier les conditions
  console.log('🎯 Dashboard - Conditions Credit Risk:');
  console.log('- userProfile:', userProfile);
  console.log('- userProfile.id:', userProfile?.id);
  console.log('- selectedSector:', selectedSector);
  
  // Utiliser localStorage pour récupérer les données
  useEffect(() => {
    const pendingData = localStorage.getItem('pendingCreditRiskData');
    if (pendingData && !pendingDataLoaded) {
      try {
        const data = JSON.parse(pendingData);
        console.log('📍 Données Credit Risk détectées dans localStorage');
        
        if (data.showCreditRisk) {
          setCreditRiskData(data);
          if (data.importedData) {
            setImportedData(data.importedData);
            console.log('📊 Données importées récupérées:', data.importedData.length, 'lignes');
          }
          setPendingDataLoaded(true);
        }
        
        // Nettoyer après utilisation
        localStorage.removeItem('pendingCreditRiskData');
      } catch (e) {
        console.error('Erreur parsing données:', e);
      }
    }
  }, [pendingDataLoaded]);

  // KPIs Généraux
  const generalKPIs: KPI[] = [
    {
      id: 'revenue',
      name: 'Chiffre d\'affaires',
      value: '€3.24M',
      change: '+29.6%',
      status: 'up',
      icon: TrendingUp,
      color: 'text-blue-500',
      sector: 'all'
    },
    {
      id: 'active-users',
      name: 'Utilisateurs actifs',
      value: '3,540',
      change: '+3.4%',
      status: 'up',
      icon: Users,
      color: 'text-green-500',
      sector: 'all'
    },
    {
      id: 'conversion',
      name: 'Taux de conversion',
      value: '4.7%',
      change: 'Stable',
      status: 'stable',
      icon: Target,
      color: 'text-yellow-500',
      sector: 'all'
    },
    {
      id: 'new-subscribers',
      name: 'Nouveaux abonnés',
      value: '+847',
      change: 'Campagne en cours',
      status: 'up',
      icon: UserPlus,
      color: 'text-purple-500',
      sector: 'all'
    }
  ];

  // KPIs Banking (Bâle III)
  const bankingKPIs: KPI[] = [
    {
      id: 'cet1',
      name: 'CET1 Ratio',
      value: '14.8%',
      description: 'Common Equity Tier 1 - Conforme Bâle III',
      threshold: '>10.5%',
      status: 'up',
      icon: Shield,
      color: 'text-blue-600',
      sector: 'banking'
    },
    {
      id: 'lcr',
      name: 'LCR',
      value: '125.5%',
      description: 'Liquidity Coverage Ratio',
      threshold: '>100%',
      status: 'up',
      icon: Activity,
      color: 'text-green-600',
      sector: 'banking'
    },
    {
      id: 'nsfr',
      name: 'NSFR',
      value: '112.3%',
      description: 'Net Stable Funding Ratio',
      threshold: '>100%',
      status: 'up',
      icon: DollarSign,
      color: 'text-blue-600',
      sector: 'banking'
    },
    {
      id: 'npl',
      name: 'NPL Ratio',
      value: '2.1%',
      description: 'Non-Performing Loans',
      status: 'down',
      icon: AlertCircle,
      color: 'text-red-500',
      sector: 'banking'
    },
    {
      id: 'roe',
      name: 'ROE',
      value: '12.8%',
      description: 'Return on Equity',
      status: 'up',
      icon: Percent,
      color: 'text-green-600',
      sector: 'banking'
    }
  ];

  // KPIs Insurance (Solvency II)
  const insuranceKPIs: KPI[] = [
    {
      id: 'scr',
      name: 'SCR Ratio',
      value: '168%',
      description: 'Solvency Capital Requirement - Solvency II',
      threshold: '>100%',
      status: 'up',
      icon: Shield,
      color: 'text-purple-600',
      sector: 'insurance'
    },
    {
      id: 'combined',
      name: 'Combined Ratio',
      value: '94.5%',
      description: 'Ratio combiné (coûts + sinistres)',
      threshold: '<100%',
      status: 'up',
      icon: Percent,
      color: 'text-green-600',
      sector: 'insurance'
    },
    {
      id: 'mcr',
      name: 'MCR Ratio',
      value: '672%',
      description: 'Minimum Capital Requirement',
      threshold: '>100%',
      status: 'up',
      icon: CheckCircle,
      color: 'text-green-600',
      sector: 'insurance'
    }
  ];

  // Données pour les graphiques
  const quarterlyData = [
    { quarter: 'Q1 2024', revenues: 120, costs: 85, profit: 35 },
    { quarter: 'Q2 2024', revenues: 150, costs: 92, profit: 58 },
    { quarter: 'Q3 2024', revenues: 180, costs: 98, profit: 82 },
    { quarter: 'Q4 2024', revenues: 200, costs: 110, profit: 90 }
  ];

  const performanceData = [
    { metric: 'Revenus', value: 100, fullMark: 100 },
    { metric: 'Coûts', value: 75, fullMark: 100 },
    { metric: 'Profit', value: 92, fullMark: 100 },
    { metric: 'Clients', value: 85, fullMark: 100 },
    { metric: 'Satisfaction', value: 88, fullMark: 100 }
  ];

  // Widget Credit Risk
  const creditRiskWidget = {
    id: 'credit-risk',
    type: 'action',
    title: 'Analyse du Risque de Crédit',
    description: 'Analysez votre portefeuille de crédit',
    icon: Shield,
    color: 'indigo',
    action: () => {
      console.log('🚀 Ouverture du module Credit Risk');
      setShowCreditRisk(true);
    },
    visible: userProfile?.id === 'banker' || selectedSector === 'banking'
  };
  
  // DEBUG: Log de la visibilité du widget
  console.log('- creditRiskWidget.visible:', creditRiskWidget.visible);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Notification de détection crédit */}
        {creditRiskData && !showCreditRisk && (
          <div className={`mb-6 p-4 rounded-lg ${
            darkMode ? 'bg-amber-900/20 border-amber-700' : 'bg-amber-50 border-amber-300'
          } border`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-amber-600 mr-3" />
                <div>
                  <p className={`font-medium ${darkMode ? 'text-amber-300' : 'text-amber-800'}`}>
                    Portefeuille de crédit détecté
                  </p>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                    {creditRiskData.analysisResult?.creditDetection?.creditColumns?.length || 0} colonnes de crédit identifiées. 
                    Cliquez sur "Credit Risk Analysis" pour analyser.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreditRisk(true)}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Analyser maintenant
              </button>
            </div>
          </div>
        )}

        {/* Section KPIs */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Indicateurs Clés de Performance
          </h2>
          
          {/* KPIs Généraux et Banking */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...generalKPIs, ...bankingKPIs].filter(kpi => 
              kpi.sector === 'all' || 
              (kpi.sector === 'banking' && (selectedSector === 'banking' || selectedSector === 'all'))
            ).map((kpi) => {
              const Icon = kpi.icon;
              
              return (
                <div
                  key={kpi.id}
                  className={`rounded-xl p-6 transition-all duration-200 hover:shadow-lg
                    ${darkMode 
                      ? 'bg-gray-800 hover:bg-gray-750' 
                      : 'bg-white hover:shadow-xl'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className={`text-sm font-medium mb-1
                        ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {kpi.name}
                      </p>
                      <p className={`text-2xl font-bold ${kpi.color}`}>
                        {kpi.value}
                      </p>
                      {kpi.change && (
                        <p className={`text-sm mt-1 flex items-center
                          ${kpi.status === 'up' ? 'text-green-500' : 
                            kpi.status === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
                          {kpi.status === 'up' ? '↑' : kpi.status === 'down' ? '↓' : '→'}
                          {' '}{kpi.change}
                        </p>
                      )}
                      {kpi.description && (
                        <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          {kpi.description}
                        </p>
                      )}
                      {kpi.threshold && (
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                          Seuil: {kpi.threshold}
                        </p>
                      )}
                    </div>
                    <Icon className={`h-8 w-8 ${kpi.color} opacity-50`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* KPIs Insurance + Credit Risk Widget sur une ligne séparée */}
          {(selectedSector === 'insurance' || selectedSector === 'all') && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* KPIs Insurance */}
              {insuranceKPIs.map((kpi) => {
                const Icon = kpi.icon;
                
                return (
                  <div
                    key={kpi.id}
                    className={`rounded-xl p-6 transition-all duration-200 hover:shadow-lg
                      ${darkMode 
                        ? 'bg-gray-800 hover:bg-gray-750' 
                        : 'bg-white hover:shadow-xl'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className={`text-sm font-medium mb-1
                          ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {kpi.name}
                        </p>
                        <p className={`text-2xl font-bold ${kpi.color}`}>
                          {kpi.value}
                        </p>
                        {kpi.change && (
                          <p className={`text-sm mt-1 flex items-center
                            ${kpi.status === 'up' ? 'text-green-500' : 
                              kpi.status === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
                            {kpi.status === 'up' ? '↑' : kpi.status === 'down' ? '↓' : '→'}
                            {' '}{kpi.change}
                          </p>
                        )}
                        {kpi.description && (
                          <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            {kpi.description}
                          </p>
                        )}
                        {kpi.threshold && (
                          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                            Seuil: {kpi.threshold}
                          </p>
                        )}
                      </div>
                      <Icon className={`h-8 w-8 ${kpi.color} opacity-50`} />
                    </div>
                  </div>
                );
              })}
              
              {/* Credit Risk Widget - Même style que les KPIs */}
              {creditRiskWidget.visible && (
                <div
                  className={`rounded-xl p-6 transition-all duration-200 hover:shadow-lg cursor-pointer
                    ${darkMode 
                      ? 'bg-gray-800 hover:bg-gray-750' 
                      : 'bg-white hover:shadow-xl'}`}
                  onClick={() => setShowCreditRisk(true)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className={`text-sm font-medium mb-1
                        ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Credit Risk Analysis
                      </p>
                      <p className={`text-2xl font-bold text-red-600`}>
                        {creditRiskData ? 'Ready' : 'Module'}
                      </p>
                      <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {creditRiskData ? `${importedData.length} prêts` : 'Disponible'}
                      </p>
                      {creditRiskData && (
                        <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          {creditRiskData.analysisResult?.creditDetection?.creditColumns?.length || 0} colonnes détectées
                        </p>
                      )}
                      <p className={`text-xs mt-1 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                        Seuil: {creditRiskData ? '> Données OK' : 'En attente'}
                      </p>
                    </div>
                    <TrendingDown className={`h-8 w-8 text-red-600 opacity-50`} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section Graphiques - Maintenant sur 2 colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Graphique Trimestriel */}
          <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Analyse Trimestrielle
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                <XAxis dataKey="quarter" stroke={darkMode ? '#9CA3AF' : '#6B7280'} />
                <YAxis stroke={darkMode ? '#9CA3AF' : '#6B7280'} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                    border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`
                  }}
                />
                <Legend />
                <Bar dataKey="revenues" fill="#3B82F6" name="Revenus" />
                <Bar dataKey="costs" fill="#EF4444" name="Coûts" />
                <Bar dataKey="profit" fill="#10B981" name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Graphique Radar */}
          <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Performance Globale
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={performanceData}>
                <PolarGrid stroke={darkMode ? '#374151' : '#E5E7EB'} />
                <PolarAngleAxis dataKey="metric" stroke={darkMode ? '#9CA3AF' : '#6B7280'} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke={darkMode ? '#9CA3AF' : '#6B7280'} />
                <Radar
                  name="Performance"
                  dataKey="value"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.6}
                />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                    border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Section Widgets */}
        <div className="mt-8">
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Outils {selectedSector === 'banking' ? 'Bancaires' : selectedSector === 'insurance' ? 'Assurance' : ''}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Widget Credit Risk dans la section Outils */}
            {creditRiskWidget.visible && (
              <div 
                onClick={creditRiskWidget.action}
                className={`rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow
                  ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-indigo-100">
                    <creditRiskWidget.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Nouveau</span>
                </div>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {creditRiskWidget.title}
                </h3>
                <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {creditRiskWidget.description}
                </p>
              </div>
            )}
            
            {/* Message si aucun outil disponible */}
            {!creditRiskWidget.visible && (
              <div className={`col-span-full text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Sélectionnez le profil "Banquier" ou le secteur "Banking" pour voir les outils disponibles</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Credit Risk - MODIFIÉ POUR LE MODE SOMBRE */}
      {showCreditRisk && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowCreditRisk(false)} />
          <div className={`absolute inset-4 ${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-xl overflow-hidden`}>
            <CreditRiskDashboard 
              data={importedData.length > 0 ? importedData : undefined}
              onClose={() => setShowCreditRisk(false)}
              darkMode={darkMode}
            />
          </div>
        </div>
      )}
    </div>
  );
};