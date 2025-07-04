import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { useFinanceStore } from '../store';
import { TrendingUp, TrendingDown, DollarSign, Percent, Shield, AlertCircle } from 'lucide-react';

const BankingCore: React.FC = () => {
  const { isDarkMode } = useFinanceStore();
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('quarter');
  const [showSimulation, setShowSimulation] = useState(false);

  // Métriques bancaires natives
  const bankingMetrics = [
    {
      label: 'NII (Net Interest Income)',
      value: '€45.2M',
      change: 3.4,
      description: 'Marge nette d\'intérêts',
      icon: DollarSign,
      color: 'text-blue-500',
      target: '€48M',
      status: 'warning'
    },
    {
      label: 'NSFR',
      value: '118%',
      change: 2.1,
      description: 'Net Stable Funding Ratio',
      icon: Shield,
      color: 'text-green-500',
      target: '> 100%',
      status: 'good'
    },
    {
      label: 'Cost/Income Ratio',
      value: '52.8%',
      change: -1.5,
      description: 'Ratio coûts/revenus',
      icon: Percent,
      color: 'text-yellow-500',
      target: '< 50%',
      status: 'warning'
    },
    {
      label: 'Tier 1 Capital',
      value: '€892M',
      change: 5.2,
      description: 'Capital de base',
      icon: Shield,
      color: 'text-purple-500',
      target: '€900M',
      status: 'good'
    }
  ];

  // Données historiques NII
  const niiHistoricalData = [
    { month: 'Jan', nii: 42.5, nim: 2.85, volume: 1580 },
    { month: 'Fév', nii: 43.1, nim: 2.87, volume: 1590 },
    { month: 'Mar', nii: 43.8, nim: 2.89, volume: 1605 },
    { month: 'Avr', nii: 44.2, nim: 2.91, volume: 1615 },
    { month: 'Mai', nii: 44.7, nim: 2.93, volume: 1625 },
    { month: 'Jun', nii: 45.2, nim: 2.95, volume: 1635 }
  ];

  // Données de décomposition des revenus
  const revenueBreakdown = [
    { name: 'Intérêts sur prêts', value: 65, amount: 29.4 },
    { name: 'Commissions', value: 20, amount: 9.0 },
    { name: 'Trading', value: 10, amount: 4.5 },
    { name: 'Autres', value: 5, amount: 2.3 }
  ];

  // Données de simulation budgétaire
  const budgetSimulation = [
    { year: '2024', revenus: 185, couts: 97, profit: 88, roe: 12.3 },
    { year: '2025', revenus: 198, couts: 102, profit: 96, roe: 13.1 },
    { year: '2026', revenus: 215, couts: 108, profit: 107, roe: 14.2 },
    { year: '2027', revenus: 235, couts: 115, profit: 120, roe: 15.5 }
  ];

  // Ratios réglementaires détaillés
  const regulatoryRatios = [
    { ratio: 'CET1', current: 14.5, minimum: 10.5, target: 15.0 },
    { ratio: 'Tier 1', current: 16.2, minimum: 12.0, target: 16.5 },
    { ratio: 'Total Capital', current: 18.8, minimum: 15.5, target: 19.0 },
    { ratio: 'Leverage', current: 5.2, minimum: 3.0, target: 5.5 }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Banking Core - Métriques & Analyses
        </h2>
        
        {/* Sélecteur de période */}
        <div className="flex space-x-2">
          {(['month', 'quarter', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? isDarkMode
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-200 text-gray-900'
                  : isDarkMode
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {period === 'month' ? 'Mois' : period === 'quarter' ? 'Trimestre' : 'Année'}
            </button>
          ))}
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {bankingMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={index}
              className={`p-6 rounded-xl shadow-lg ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-8 h-8 ${metric.color}`} />
                <div className={`flex items-center text-sm ${
                  metric.change > 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {metric.change > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  {Math.abs(metric.change)}%
                </div>
              </div>
              <h3 className={`text-lg font-semibold mb-1 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {metric.value}
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {metric.label}
              </p>
              <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {metric.description}
              </p>
              <div className="mt-3 pt-3 border-t border-gray-700">
                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Cible: {metric.target}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evolution NII et NIM */}
        <div className={`p-6 rounded-xl shadow-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Évolution NII & NIM
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={niiHistoricalData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="month" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} fontSize={12} />
              <YAxis yAxisId="left" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                  border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: isDarkMode ? '#ffffff' : '#000000'
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="nii"
                stroke="#3b82f6"
                strokeWidth={2}
                name="NII (M€)"
                dot={{ fill: '#3b82f6', r: 4 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="nim"
                stroke="#10b981"
                strokeWidth={2}
                name="NIM (%)"
                dot={{ fill: '#10b981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Répartition des revenus */}
        <div className={`p-6 rounded-xl shadow-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Répartition des Revenus
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueBreakdown}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {revenueBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                  border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: isDarkMode ? '#ffffff' : '#000000'
                }}
                formatter={(value: any, name: any) => [`${value}%`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {revenueBreakdown.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[index] }}></div>
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {item.name}: €{item.amount}M
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ratios réglementaires */}
      <div className={`p-6 rounded-xl shadow-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Ratios Réglementaires - Conformité Bâle III
        </h3>
        <div className="space-y-4">
          {regulatoryRatios.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {item.ratio}
                </span>
                <span className={`text-sm ${
                  item.current >= item.target ? 'text-green-500' : 
                  item.current >= item.minimum ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {item.current}%
                </span>
              </div>
              <div className="relative">
                <div className={`h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div
                    className={`h-2 rounded-full ${
                      item.current >= item.target ? 'bg-green-500' : 
                      item.current >= item.minimum ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min((item.current / item.target) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Min: {item.minimum}%
                  </span>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Cible: {item.target}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simulation budgétaire */}
      <div className={`p-6 rounded-xl shadow-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Simulation Budgétaire 3 ans
          </h3>
          <button
            onClick={() => setShowSimulation(!showSimulation)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              showSimulation
                ? isDarkMode
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-200 text-gray-900'
                : isDarkMode
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {showSimulation ? 'Masquer' : 'Afficher'} Détails
          </button>
        </div>
        
        {showSimulation && (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgetSimulation}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="year" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} fontSize={12} />
              <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                  border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: isDarkMode ? '#ffffff' : '#000000'
                }}
              />
              <Legend />
              <Bar dataKey="revenus" fill="#3b82f6" name="Revenus (M€)" />
              <Bar dataKey="couts" fill="#ef4444" name="Coûts (M€)" />
              <Bar dataKey="profit" fill="#10b981" name="Profit (M€)" />
            </BarChart>
          </ResponsiveContainer>
        )}
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          {budgetSimulation.map((year, index) => (
            <div key={index} className={`text-center p-3 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {year.year}
              </p>
              <p className={`text-lg font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                €{year.profit}M
              </p>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                ROE: {year.roe}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BankingCore;