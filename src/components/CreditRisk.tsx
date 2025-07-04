import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingDown, Shield, Activity } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter,
  Cell, PieChart, Pie
} from 'recharts';
import { useFinanceStore } from '../store';

const CreditRisk: React.FC = () => {
  const { isDarkMode } = useFinanceStore();
  const [selectedPeriod, setSelectedPeriod] = useState('12M');
  const [selectedPortfolio, setSelectedPortfolio] = useState('retail');
  const [showStressDialog, setShowStressDialog] = useState(false);
  const [stressMultiplier, setStressMultiplier] = useState(1.5);

  // Données PD (Probability of Default) par segment
  const pdData = [
    { segment: 'AAA', pd: 0.02, exposure: 45000000, lgd: 25, ead: 42000000 },
    { segment: 'AA', pd: 0.05, exposure: 120000000, lgd: 30, ead: 115000000 },
    { segment: 'A', pd: 0.15, exposure: 230000000, lgd: 35, ead: 220000000 },
    { segment: 'BBB', pd: 0.8, exposure: 180000000, lgd: 40, ead: 175000000 },
    { segment: 'BB', pd: 2.5, exposure: 95000000, lgd: 45, ead: 92000000 },
    { segment: 'B', pd: 5.8, exposure: 65000000, lgd: 50, ead: 63000000 },
    { segment: 'CCC', pd: 12.5, exposure: 25000000, lgd: 60, ead: 24000000 }
  ];

  // Calcul ECL (Expected Credit Loss) = PD × LGD × EAD
  const eclData = pdData.map(item => ({
    ...item,
    ecl: (item.pd / 100) * (item.lgd / 100) * item.ead,
    eclPercentage: ((item.pd / 100) * (item.lgd / 100) * 100).toFixed(2)
  }));

  // Evolution temporelle du risque
  const riskEvolution = [
    { month: 'Jan', pd_retail: 1.2, pd_corporate: 2.1, pd_mortgage: 0.8 },
    { month: 'Fév', pd_retail: 1.3, pd_corporate: 2.0, pd_mortgage: 0.7 },
    { month: 'Mar', pd_retail: 1.4, pd_corporate: 2.2, pd_mortgage: 0.8 },
    { month: 'Avr', pd_retail: 1.3, pd_corporate: 2.3, pd_mortgage: 0.9 },
    { month: 'Mai', pd_retail: 1.5, pd_corporate: 2.1, pd_mortgage: 0.8 },
    { month: 'Jun', pd_retail: 1.6, pd_corporate: 2.4, pd_mortgage: 0.9 }
  ];

  // Matrice de migration
  const migrationMatrix = [
    { from: 'AAA', AAA: 92.5, AA: 6.5, A: 0.8, BBB: 0.2, BB: 0, B: 0, CCC: 0, D: 0 },
    { from: 'AA', AAA: 1.2, AA: 91.8, A: 6.2, BBB: 0.6, BB: 0.2, B: 0, CCC: 0, D: 0 },
    { from: 'A', AAA: 0.1, AA: 2.5, A: 91.2, BBB: 5.8, BB: 0.3, B: 0.1, CCC: 0, D: 0 },
    { from: 'BBB', AAA: 0, AA: 0.3, A: 4.2, BBB: 89.5, BB: 5.2, B: 0.6, CCC: 0.1, D: 0.1 },
    { from: 'BB', AAA: 0, AA: 0, A: 0.2, BBB: 5.8, BB: 86.2, B: 6.8, CCC: 0.8, D: 0.2 },
    { from: 'B', AAA: 0, AA: 0, A: 0, BBB: 0.3, BB: 4.5, B: 82.8, CCC: 10.2, D: 2.2 },
    { from: 'CCC', AAA: 0, AA: 0, A: 0, BBB: 0, BB: 0.5, B: 2.8, CCC: 78.5, D: 18.2 }
  ];

  // Stress Test Scenarios
  const stressScenarios = [
    { scenario: 'Base', pd_increase: 0, lgd_increase: 0, ecl_impact: 0 },
    { scenario: 'Adverse', pd_increase: 50, lgd_increase: 20, ecl_impact: 85 },
    { scenario: 'Severely Adverse', pd_increase: 150, lgd_increase: 40, ecl_impact: 280 }
  ];

  // KPIs
  const riskKPIs = [
    { label: 'PD Moyen', value: '2.3%', trend: 0.2, status: 'warning' },
    { label: 'LGD Moyen', value: '38.5%', trend: -0.5, status: 'good' },
    { label: 'ECL Total', value: '€18.2M', trend: 1.2, status: 'warning' },
    { label: 'Coverage Ratio', value: '125%', trend: 0, status: 'good' }
  ];

  // Données pour l'évolution historique
  const historicalEvolution = [
    { year: '2020', stability: 88.5, upgrade: 4.2, downgrade: 7.3 },
    { year: '2021', stability: 87.2, upgrade: 5.1, downgrade: 7.7 },
    { year: '2022', stability: 86.8, upgrade: 4.8, downgrade: 8.4 },
    { year: '2023', stability: 88.1, upgrade: 4.5, downgrade: 7.4 },
    { year: '2024', stability: 87.5, upgrade: 4.9, downgrade: 7.6 }
  ];

  // Fonctions de calcul pour les statistiques
  const calculateStabilityRate = () => {
    const stabilitySum = migrationMatrix.reduce((sum, row) => {
      const rating = row.from;
      return sum + (row[rating as keyof typeof row] as number || 0);
    }, 0);
    return (stabilitySum / migrationMatrix.length).toFixed(1);
  };

  const calculateUpgradeRate = () => {
    const ratings = ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'D'];
    let upgradeSum = 0;
    let count = 0;

    migrationMatrix.forEach((row, rowIndex) => {
      ratings.forEach((rating, colIndex) => {
        if (colIndex < rowIndex) {
          upgradeSum += row[rating as keyof typeof row] as number || 0;
          count++;
        }
      });
    });

    return count > 0 ? (upgradeSum / migrationMatrix.length).toFixed(1) : '0.0';
  };

  const calculateDowngradeRate = () => {
    const ratings = ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'D'];
    let downgradeSum = 0;
    let count = 0;

    migrationMatrix.forEach((row, rowIndex) => {
      ratings.forEach((rating, colIndex) => {
        if (colIndex > rowIndex) {
          downgradeSum += row[rating as keyof typeof row] as number || 0;
          count++;
        }
      });
    });

    return count > 0 ? (downgradeSum / migrationMatrix.length).toFixed(1) : '0.0';
  };

  // Fonction d'export CSV
  const exportMatrixToCSV = () => {
    const ratings = ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'D'];
    let csv = 'De/Vers,' + ratings.join(',') + ',Total\n';
    
    migrationMatrix.forEach(row => {
      const values = ratings.map(rating => row[rating as keyof typeof row] || 0);
      const total = values.reduce((sum, val) => sum + Number(val), 0);
      csv += `${row.from},${values.join(',')},${total.toFixed(1)}\n`;
    });

    // Télécharger le fichier
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `migration_matrix_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Fonction d'export PDF
  const exportMatrixToPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const html2canvas = (await import('html2canvas')).default;
    
    const element = document.getElementById('migration-matrix-table');
    if (!element) return;
    
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('l', 'mm', 'a4');
    pdf.addImage(imgData, 'PNG', 10, 10, 280, 150);
    pdf.save(`migration_matrix_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Module Credit Risk - IFRS 9
          </h2>
          <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Analyse PD, LGD, EAD et calcul des provisions ECL
          </p>
        </div>
        
        {/* Sélecteurs de période et portfolio */}
        <div className="flex gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDarkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <option value="1M">1 Mois</option>
            <option value="3M">3 Mois</option>
            <option value="6M">6 Mois</option>
            <option value="12M">12 Mois</option>
          </select>
          
          <select
            value={selectedPortfolio}
            onChange={(e) => setSelectedPortfolio(e.target.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDarkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <option value="retail">Retail</option>
            <option value="corporate">Corporate</option>
            <option value="mortgage">Mortgage</option>
            <option value="all">Tous</option>
          </select>
        </div>
      </div>

      {/* KPIs Credit Risk */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {riskKPIs.map((kpi, index) => (
          <div key={index} className={`p-4 rounded-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <h4 className={`text-sm font-medium ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {kpi.label}
            </h4>
            <p className={`text-2xl font-bold mt-2 ${
              kpi.status === 'good' ? 'text-green-500' : 'text-yellow-500'
            }`}>
              {kpi.value}
            </p>
            <p className={`text-xs mt-1 ${
              kpi.trend > 0 ? 'text-red-500' : kpi.trend < 0 ? 'text-green-500' : 'text-gray-500'
            }`}>
              {kpi.trend > 0 ? '↑' : kpi.trend < 0 ? '↓' : '→'} {Math.abs(kpi.trend)}%
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique ECL par Rating */}
        <div className={`p-6 rounded-xl shadow-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Expected Credit Loss (ECL) par Rating
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eclData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="segment" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
              <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                  border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                }}
                formatter={(value: number) => `€${(value / 1000000).toFixed(2)}M`}
              />
              <Bar dataKey="ecl" fill="#ef4444" name="ECL (€)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Evolution temporelle du PD */}
        <div className={`p-6 rounded-xl shadow-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Évolution de la Probabilité de Défaut (%)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={riskEvolution}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="month" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
              <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                  border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="pd_retail" stroke="#3b82f6" name="Retail" strokeWidth={2} />
              <Line type="monotone" dataKey="pd_corporate" stroke="#ef4444" name="Corporate" strokeWidth={2} />
              <Line type="monotone" dataKey="pd_mortgage" stroke="#10b981" name="Mortgage" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Matrice de Migration Améliorée */}
      <div className={`p-6 rounded-xl shadow-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Matrice de Migration des Ratings (%)
          </h3>
          <div className="flex gap-2">
            {/* Bouton Export CSV */}
            <button
              onClick={exportMatrixToCSV}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              📥 Export CSV
            </button>
            
            {/* Bouton Export PDF */}
            <button
              onClick={exportMatrixToPDF}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              📄 Export PDF
            </button>
            
            {/* Bouton Stress Test */}
            <button
              onClick={() => setShowStressDialog(true)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                isDarkMode
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              ⚡ Stress Test
            </button>
          </div>
        </div>

        {/* Légende Heatmap */}
        <div className="flex items-center justify-end mb-3 text-xs">
          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Probabilité:
          </span>
          <div className="flex items-center ml-2">
            <div className="w-4 h-4 bg-blue-100"></div>
            <span className="mx-1">Faible</span>
            <div className="w-4 h-4 bg-blue-300"></div>
            <span className="mx-1">Moyenne</span>
            <div className="w-4 h-4 bg-blue-500"></div>
            <span className="mx-1">Élevée</span>
          </div>
        </div>

        <div className="overflow-x-auto" id="migration-matrix-table">
          <table className="w-full text-sm">
            <thead>
              <tr className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                <th className="px-4 py-2 text-left">De/Vers</th>
                {['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'D'].map(rating => (
                  <th key={rating} className="px-4 py-2 text-center">{rating}</th>
                ))}
                <th className="px-4 py-2 text-center font-bold">Total</th>
              </tr>
            </thead>
            <tbody>
              {migrationMatrix.map((row, rowIndex) => {
                const rowTotal = ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'D']
                  .reduce((sum, rating) => sum + (row[rating as keyof typeof row] as number || 0), 0);
                
                return (
                  <tr key={rowIndex} className={`border-t ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <td className={`px-4 py-2 font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {row.from}
                    </td>
                    {['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'D'].map((rating, colIndex) => {
                      const value = row[rating as keyof typeof row] as number;
                      const isDiagonal = row.from === rating;
                      const bgIntensity = Math.min(value / 20, 1);
                      
                      return (
                        <td 
                          key={rating} 
                          className={`px-4 py-2 text-center cursor-pointer transition-all hover:opacity-80`}
                          style={{
                            backgroundColor: isDiagonal
                              ? `rgba(16, 185, 129, ${bgIntensity * 0.4})` // Vert pour la diagonale
                              : value > 0 
                                ? `rgba(59, 130, 246, ${bgIntensity * 0.3})` // Bleu pour les autres
                                : 'transparent',
                            color: isDarkMode ? '#e5e7eb' : '#1f2937',
                            fontWeight: isDiagonal ? 'bold' : 'normal'
                          }}
                          title={`${value.toFixed(1)}% des entités notées ${row.from} ${
                            isDiagonal ? 'restent' : 'migrent vers'
                          } ${rating}`}
                        >
                          {value.toFixed(1)}
                        </td>
                      );
                    })}
                    <td className={`px-4 py-2 text-center font-bold ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {rowTotal.toFixed(1)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Statistiques de Migration */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div className={`p-3 rounded-lg ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Taux de Stabilité
            </p>
            <p className="text-lg font-bold text-green-500">
              {calculateStabilityRate()}%
            </p>
          </div>
          <div className={`p-3 rounded-lg ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Taux d'Amélioration
            </p>
            <p className="text-lg font-bold text-blue-500">
              {calculateUpgradeRate()}%
            </p>
          </div>
          <div className={`p-3 rounded-lg ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Taux de Dégradation
            </p>
            <p className="text-lg font-bold text-red-500">
              {calculateDowngradeRate()}%
            </p>
          </div>
        </div>
      </div>

      {/* Stress Test Scenarios */}
      <div className={`p-6 rounded-xl shadow-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Stress Test BCE - Impact sur ECL
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stressScenarios.map((scenario, index) => (
            <div key={index} className={`p-4 rounded-lg border-2 ${
              scenario.scenario === 'Base' 
                ? 'border-green-500' 
                : scenario.scenario === 'Adverse'
                ? 'border-yellow-500'
                : 'border-red-500'
            } ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h4 className={`font-semibold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {scenario.scenario}
              </h4>
              <div className="space-y-2 text-sm">
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  PD: <span className="font-medium">+{scenario.pd_increase}%</span>
                </p>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  LGD: <span className="font-medium">+{scenario.lgd_increase}%</span>
                </p>
                <p className={`font-bold ${
                  scenario.ecl_impact === 0 
                    ? 'text-green-500' 
                    : scenario.ecl_impact < 100
                    ? 'text-yellow-500'
                    : 'text-red-500'
                }`}>
                  Impact ECL: +{scenario.ecl_impact}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Evolution Historique des Matrices */}
      <div className={`p-6 rounded-xl shadow-lg mt-6 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Évolution Historique des Taux de Migration
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={historicalEvolution}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
            <XAxis dataKey="year" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
            <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
            <Tooltip 
              contentStyle={{
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="stability" stroke="#10b981" name="Stabilité %" strokeWidth={2} />
            <Line type="monotone" dataKey="upgrade" stroke="#3b82f6" name="Amélioration %" strokeWidth={2} />
            <Line type="monotone" dataKey="downgrade" stroke="#ef4444" name="Dégradation %" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Dialog Stress Test */}
      {showStressDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-xl max-w-md w-full mx-4 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Stress Test - Matrice de Migration
            </h3>
            <p className={`mb-4 text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Simuler l'impact d'un choc économique sur les probabilités de migration
            </p>
            
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Multiplicateur de stress : {stressMultiplier}x
              </label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={stressMultiplier}
                onChange={(e) => setStressMultiplier(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowStressDialog(false)}
                className={`px-4 py-2 rounded-lg ${
                  isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  // Appliquer le stress test
                  console.log('Stress test appliqué avec multiplicateur:', stressMultiplier);
                  setShowStressDialog(false);
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                Appliquer le Stress
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditRisk;