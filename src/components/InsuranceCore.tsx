// Fichier: C:\PROJETS-DEVELOPPEMENT\Analyse_Donnees_CLEAN\project\src\components\InsuranceCore.tsx

import React, { useState, useEffect } from 'react';
import {
  Shield, TrendingUp, AlertTriangle, Activity,
  PieChart, BarChart3, DollarSign, Users,
  FileText, Download, RefreshCw, Info,
  Check, X, Clock, Target
} from 'lucide-react';
import { useFinanceStore } from '../store';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart as RechartsPieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

interface SolvencyData {
  scr: number;
  mcr: number;
  ownFunds: number;
  scrRatio: number;
  mcrRatio: number;
  riskMargin: number;
  technicalProvisions: number;
}

interface RiskModule {
  name: string;
  value: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

interface KPIData {
  combinedRatio: number;
  lossRatio: number;
  expenseRatio: number;
  roe: number;
  premiumGrowth: number;
  claimsFrequency: number;
}

const InsuranceCore: React.FC = () => {
  const { isDarkMode } = useFinanceStore();
  const [selectedPeriod, setSelectedPeriod] = useState('Q4-2024');
  const [selectedView, setSelectedView] = useState<'overview' | 'solvency' | 'technical' | 'kpis'>('overview');
  const [isLoading, setIsLoading] = useState(false);

  // Données simulées Solvency II
  const [solvencyData] = useState<SolvencyData>({
    scr: 1150000000, // 1.15B€
    mcr: 287500000,  // 287.5M€
    ownFunds: 1932000000, // 1.932B€
    scrRatio: 168,
    mcrRatio: 672,
    riskMargin: 85000000, // 85M€
    technicalProvisions: 3450000000 // 3.45B€
  });

  // Modules de risque
  const riskModules: RiskModule[] = [
    { name: 'Risque de marché', value: 517500000, percentage: 45, trend: 'up' },
    { name: 'Risque de souscription vie', value: 230000000, percentage: 20, trend: 'stable' },
    { name: 'Risque de souscription non-vie', value: 172500000, percentage: 15, trend: 'down' },
    { name: 'Risque de contrepartie', value: 172500000, percentage: 15, trend: 'up' },
    { name: 'Risque opérationnel', value: 57500000, percentage: 5, trend: 'stable' }
  ];

  // KPIs assurance
  const [kpiData] = useState<KPIData>({
    combinedRatio: 94.5,
    lossRatio: 62.3,
    expenseRatio: 32.2,
    roe: 12.8,
    premiumGrowth: 7.5,
    claimsFrequency: 0.045
  });

  // Évolution historique SCR
  const scrEvolution = [
    { period: 'Q1-2023', scr: 145, mcr: 580, ownFunds: 1650 },
    { period: 'Q2-2023', scr: 148, mcr: 592, ownFunds: 1680 },
    { period: 'Q3-2023', scr: 152, mcr: 608, ownFunds: 1720 },
    { period: 'Q4-2023', scr: 155, mcr: 620, ownFunds: 1780 },
    { period: 'Q1-2024', scr: 158, mcr: 632, ownFunds: 1820 },
    { period: 'Q2-2024', scr: 162, mcr: 648, ownFunds: 1850 },
    { period: 'Q3-2024', scr: 165, mcr: 660, ownFunds: 1890 },
    { period: 'Q4-2024', scr: 168, mcr: 672, ownFunds: 1932 }
  ];

  // Données pour le radar chart des KPIs
  const radarData = [
    { metric: 'Solvabilité', value: 85, fullMark: 100 },
    { metric: 'Rentabilité', value: 78, fullMark: 100 },
    { metric: 'Croissance', value: 82, fullMark: 100 },
    { metric: 'Efficacité', value: 88, fullMark: 100 },
    { metric: 'Qualité', value: 92, fullMark: 100 },
    { metric: 'Liquidité', value: 86, fullMark: 100 }
  ];

  // Combined Ratio trend
  const combinedRatioTrend = [
    { month: 'Jan', ratio: 96.2 },
    { month: 'Fév', ratio: 95.8 },
    { month: 'Mar', ratio: 95.1 },
    { month: 'Avr', ratio: 94.9 },
    { month: 'Mai', ratio: 94.5 },
    { month: 'Jun', ratio: 94.8 },
    { month: 'Jul', ratio: 94.3 },
    { month: 'Aoû', ratio: 94.1 },
    { month: 'Sep', ratio: 94.5 },
    { month: 'Oct', ratio: 94.6 },
    { month: 'Nov', ratio: 94.4 },
    { month: 'Déc', ratio: 94.5 }
  ];

  const generateQRT = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Rapport QRT Solvency II généré avec succès !');
    }, 2000);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => `${value}%`;

  const getStatusColor = (ratio: number, threshold: number) => {
    if (ratio >= threshold + 50) return 'text-green-500';
    if (ratio >= threshold) return 'text-yellow-500';
    return 'text-red-500';
  };

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Insurance Core - Solvency II
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Tableau de bord réglementaire et KPIs assurance
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="Q4-2024">Q4 2024</option>
              <option value="Q3-2024">Q3 2024</option>
              <option value="Q2-2024">Q2 2024</option>
              <option value="Q1-2024">Q1 2024</option>
            </select>
            
            <button
              onClick={generateQRT}
              disabled={isLoading}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              <span>Générer QRT</span>
            </button>
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: <PieChart className="w-4 h-4" /> },
            { id: 'solvency', label: 'Solvabilité', icon: <Shield className="w-4 h-4" /> },
            { id: 'technical', label: 'Provisions techniques', icon: <FileText className="w-4 h-4" /> },
            { id: 'kpis', label: 'KPIs métier', icon: <Activity className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedView(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-all ${
                selectedView === tab.id
                  ? 'border-purple-600 text-purple-600'
                  : `border-transparent ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Vue d'ensemble */}
      {selectedView === 'overview' && (
        <div className="space-y-6">
          {/* Cartes KPI principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  SCR Ratio
                </span>
              </div>
              <div className={`text-3xl font-bold ${getStatusColor(solvencyData.scrRatio, 100)}`}>
                {solvencyData.scrRatio}%
              </div>
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-500">+5%</span>
                <span className={`ml-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>vs Q3</span>
              </div>
            </div>

            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                  <DollarSign className="w-6 h-6 text-pink-600" />
                </div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Fonds propres
                </span>
              </div>
              <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatCurrency(solvencyData.ownFunds / 1000000)}M
              </div>
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-500">+8.5%</span>
                <span className={`ml-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>YoY</span>
              </div>
            </div>

            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <Activity className="w-6 h-6 text-indigo-600" />
                </div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Combined Ratio
                </span>
              </div>
              <div className={`text-3xl font-bold ${kpiData.combinedRatio < 100 ? 'text-green-500' : 'text-red-500'}`}>
                {kpiData.combinedRatio}%
              </div>
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-500">-2.1%</span>
                <span className={`ml-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>vs 2023</span>
              </div>
            </div>

            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  ROE
                </span>
              </div>
              <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {kpiData.roe}%
              </div>
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-500">+0.8%</span>
                <span className={`ml-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>vs target</span>
              </div>
            </div>
          </div>

          {/* Graphiques principaux */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Évolution des ratios de solvabilité */}
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Évolution des ratios de solvabilité
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={scrEvolution}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="period" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="scr"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="SCR Ratio"
                    dot={{ fill: '#8b5cf6' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mcr"
                    stroke="#ec4899"
                    strokeWidth={2}
                    name="MCR Ratio"
                    dot={{ fill: '#ec4899' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Décomposition du SCR */}
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Décomposition du SCR par module de risque
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={riskModules}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskModules.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Performance radar */}
          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Performance globale
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                <PolarAngleAxis dataKey="metric" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                <Radar
                  name="Performance"
                  dataKey="value"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Vue Solvabilité */}
      {selectedView === 'solvency' && (
        <div className="space-y-6">
          {/* Détails Solvency II */}
          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Exigences de capital et fonds propres
            </h3>
            
            <div className="space-y-4">
              {/* SCR */}
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    SCR (Solvency Capital Requirement)
                  </span>
                  <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {formatCurrency(solvencyData.scr)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-8 relative">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-pink-600 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                    style={{ width: `${Math.min((solvencyData.ownFunds / solvencyData.scr) * 100, 100)}%` }}
                  >
                    {solvencyData.scrRatio}%
                  </div>
                </div>
              </div>

              {/* MCR */}
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    MCR (Minimum Capital Requirement)
                  </span>
                  <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {formatCurrency(solvencyData.mcr)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-8 relative">
                  <div
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                    style={{ width: `${Math.min((solvencyData.ownFunds / solvencyData.mcr) * 100, 100)}%` }}
                  >
                    {solvencyData.mcrRatio}%
                  </div>
                </div>
              </div>

              {/* Fonds propres éligibles */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Fonds propres Tier 1
                    </p>
                    <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatCurrency(solvencyData.ownFunds * 0.85)}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Fonds propres Tier 2
                    </p>
                    <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatCurrency(solvencyData.ownFunds * 0.12)}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Fonds propres Tier 3
                    </p>
                    <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatCurrency(solvencyData.ownFunds * 0.03)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modules de risque détaillés */}
          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Modules de risque SCR
            </h3>
            
            <div className="space-y-4">
              {riskModules.map((module, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[index] }} />
                      <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {module.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {formatCurrency(module.value)}
                      </span>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {module.percentage}%
                      </span>
                      {module.trend === 'up' && <TrendingUp className="w-4 h-4 text-red-500" />}
                      {module.trend === 'down' && <TrendingUp className="w-4 h-4 text-green-500 transform rotate-180" />}
                      {module.trend === 'stable' && <span className="w-4 h-4 text-gray-500">—</span>}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${module.percentage}%`,
                        backgroundColor: COLORS[index]
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Vue Provisions techniques */}
      {selectedView === 'technical' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Provisions techniques et marge de risque
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                  Provisions techniques brutes
                </p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatCurrency(solvencyData.technicalProvisions)}
                </p>
              </div>
              
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                  Marge de risque
                </p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatCurrency(solvencyData.riskMargin)}
                </p>
              </div>
              
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                  Best Estimate
                </p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatCurrency(solvencyData.technicalProvisions - solvencyData.riskMargin)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vue KPIs métier */}
      {selectedView === 'kpis' && (
        <div className="space-y-6">
          {/* Combined Ratio Analysis */}
          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Analyse du Combined Ratio
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={combinedRatioTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                    <XAxis dataKey="month" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                    <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="ratio"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={{ fill: '#8b5cf6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Combined Ratio actuel
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {kpiData.combinedRatio}%
                    </p>
                  </div>
                  <Check className="w-8 h-8 text-green-500" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Loss Ratio
                    </span>
                    <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {kpiData.lossRatio}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Expense Ratio
                    </span>
                    <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {kpiData.expenseRatio}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Autres KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-indigo-500" />
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Croissance
                </span>
              </div>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                +{kpiData.premiumGrowth}%
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                Croissance des primes
              </p>
            </div>

            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center justify-between mb-4">
                <Target className="w-8 h-8 text-green-500" />
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Rentabilité
                </span>
              </div>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {kpiData.roe}%
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                Return on Equity
              </p>
            </div>

            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle className="w-8 h-8 text-orange-500" />
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Sinistralité
                </span>
              </div>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {(kpiData.claimsFrequency * 100).toFixed(1)}%
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                Fréquence sinistres
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsuranceCore;