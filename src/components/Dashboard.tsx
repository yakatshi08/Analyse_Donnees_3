import React, { useEffect } from 'react';
import { TrendingUp, Users, Target, UserPlus } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { useFinanceStore } from '../store';

// DEBUG - AJOUTEZ CES LIGNES TEMPORAIREMENT
console.log('=== DEBUG STORE ===');
console.log('Store complet:', useFinanceStore.getState());
console.log('quarterlyData:', useFinanceStore.getState().quarterlyData);
console.log('==================');

const Dashboard: React.FC = () => {
  const { isDarkMode, quarterlyData, kpis } = useFinanceStore();
  const { apiConnected } = useFinanceStore();

  // DEBUG TEMPORAIRE - À SUPPRIMER APRÈS
  useEffect(() => {
    console.log('quarterlyData from store:', quarterlyData);
    console.log('quarterlyData length:', quarterlyData.length);
    if (quarterlyData.length > 0) {
      console.log('First item:', quarterlyData[0]);
    }
  }, [quarterlyData]);

  useEffect(() => {
    if (apiConnected) {
      console.log('✅ API connectée avec succès');
    }
  }, [apiConnected]);

  const kpiData = [
    {
      title: "Chiffre d'affaires",
      value: "€3.24M",
      change: "+29.6% par rapport au trimestre dernier",
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
      value: "+847",
      change: "Campagne marketing en cours",
      icon: UserPlus,
      color: "text-purple-500",
      positive: true
    }
  ];

  // ✅ NOUVELLE VERSION de quarterlyDataDisplay
  const quarterlyDataDisplay = quarterlyData.map((q, index) => ({
    quarter: q.quarter || `Q${index + 1} 2024`,
    Revenus: q.revenue || q.revenu || 0,
    Coûts: q.costs || q.couts || 0,
    Profit: q.profit || 0
  }));

  console.log('quarterlyData:', quarterlyData);
  console.log('quarterlyDataDisplay:', quarterlyDataDisplay);

  const radarData = [
    { subject: 'Revenus', A: 100, fullMark: 100 },
    { subject: 'Coûts', A: 75, fullMark: 100 },
    { subject: 'Profit', A: 92, fullMark: 100 },
    { subject: 'Clients', A: 85, fullMark: 100 },
    { subject: 'Satisfaction', A: 88, fullMark: 100 },
  ];

  const nplKpi = kpis.find(k => k.label === 'NPL Ratio');
  const cet1Kpi = kpis.find(k => k.label === 'CET1 Ratio');
  const lcrKpi = kpis.find(k => k.label === 'LCR');
  const roeKpi = kpis.find(k => k.label === 'ROE');

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
        {/* Bar Chart */}
        <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Analyse Trimestrielle 2024
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={quarterlyDataDisplay}>
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

      {/* Métriques Bancaires */}
      <div className="mt-8">
        <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Métriques Bancaires & Réglementaires
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* NPL, CET1, LCR, ROE ici (inchangés) */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
