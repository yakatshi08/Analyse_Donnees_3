import React from 'react';
import { TrendingUp, Users, Target, UserPlus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface DashboardProps {
  isDarkMode: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isDarkMode }) => {
  const kpiData = [
    {
      title: "Chiffre d'affaires",
      value: "€120,450",
      change: "+8,2% par rapport au mois dernier",
      icon: TrendingUp,
      color: "text-blue-500",
      positive: true
    },
    {
      title: "Utilisateurs actifs",
      value: "3,540",
      change: "+3,4% cette semaine",
      icon: Users,
      color: "text-green-500",
      positive: true
    },
    {
      title: "Taux de conversion",
      value: "4.7%",
      change: "Stable par rapport au mois dernier",
      icon: Target,
      color: "text-yellow-500",
      positive: null
    },
    {
      title: "Nouveaux abonnés",
      value: "+245",
      change: "Campagne marketing en cours",
      icon: UserPlus,
      color: "text-purple-500",
      positive: true
    }
  ];

  const quarterlyData = [
    { quarter: 'Q1 2024', Revenus: 75000, Coûts: 45000, Profit: 30000 },
    { quarter: 'Q2 2024', Revenus: 85000, Coûts: 48000, Profit: 37000 },
    { quarter: 'Q3 2024', Revenus: 95000, Coûts: 52000, Profit: 43000 },
    { quarter: 'Q4 2024', Revenus: 120000, Coûts: 65000, Profit: 55000 },
  ];

  const radarData = [
    { subject: 'Revenus', A: 100, fullMark: 100 },
    { subject: 'Coûts', A: 75, fullMark: 100 },
    { subject: 'Profit', A: 92, fullMark: 100 },
    { subject: 'Clients', A: 85, fullMark: 100 },
    { subject: 'Satisfaction', A: 88, fullMark: 100 },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div
              key={index}
              className={`p-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer ${
                isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-8 h-8 ${kpi.color}`} />
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {kpi.value}
                </div>
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                {kpi.title}
              </h3>
              <p className={`text-sm ${
                kpi.positive === true
                  ? 'text-green-500'
                  : kpi.positive === false
                    ? 'text-red-500'
                    : isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {kpi.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Combined Bar and Line Chart */}
        <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Analyse Trimestrielle 2024
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={quarterlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="quarter" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} fontSize={12} />
              <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} fontSize={12} />
              <Tooltip contentStyle={{
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                borderRadius: '8px',
                color: isDarkMode ? '#ffffff' : '#000000'
              }} />
              <Legend />
              <Bar dataKey="Revenus" fill="#3b82f6" name="Revenus (€)" />
              <Bar dataKey="Coûts" fill="#ef4444" name="Coûts (€)" />
              <Bar dataKey="Profit" fill="#10b981" name="Profit (€)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart */}
        <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Performance Globale
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: 10 }} />
              <Radar name="Performance" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.3} strokeWidth={2} />
              <Tooltip contentStyle={{
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                borderRadius: '8px',
                color: isDarkMode ? '#ffffff' : '#000000'
              }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* NOUVELLE SECTION FINTECH - DÉBUT */}
      <div className="mt-8">
        <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Métriques Bancaires & Réglementaires
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* NPL Ratio */}
          <div className={`p-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer ${
            isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                2.8%
              </div>
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              NPL Ratio
            </h3>
            <p className="text-sm text-green-500">
              -0.3% vs trimestre précédent
            </p>
          </div>

          {/* CET1 Ratio */}
          <div className={`p-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer ${
            isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                15.5%
              </div>
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              CET1 Ratio
            </h3>
            <p className="text-sm text-green-500">
              Conforme Bâle III (&gt;10.5%)
            </p>
          </div>

          {/* LCR */}
          <div className={`p-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer ${
            isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 flex items-center justify-center">
                <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                142%
              </div>
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              LCR
            </h3>
            <p className="text-sm text-green-500">
              Liquidité optimale (&gt;100%)
            </p>
          </div>

          {/* ROE */}
          <div className={`p-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer ${
            isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                12.3%
              </div>
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              ROE
            </h3>
            <p className="text-sm text-green-500">
              Performance supérieure au secteur
            </p>
          </div>
        </div>
      </div>
      {/* NOUVELLE SECTION FINTECH - FIN */}
    </div>
  );
};

export default Dashboard;
