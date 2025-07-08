import React, { useState } from 'react';
import { 
  Shield, Calculator, FileCheck, Activity,
  TrendingUp, AlertTriangle, PieChart, ArrowUp, ArrowDown, Info
} from 'lucide-react';
import { useStore } from '../store';
import { useTranslation } from '../hooks/useTranslation';

export const InsuranceCore: React.FC = () => {
  const { darkMode } = useStore();
  const { t } = useTranslation();
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const insuranceMetrics = [
    {
      id: 'scr-coverage',
      name: 'SCR Coverage',
      value: '185%',
      trend: '+8%',
      status: 'healthy',
      icon: Shield,
      color: 'purple',
      description: 'Solvency Capital Requirement'
    },
    {
      id: 'combined-ratio',
      name: 'Combined Ratio',
      value: '94.2%',
      trend: '-2.1%',
      status: 'healthy',
      icon: PieChart,
      color: 'blue',
      description: 'Loss Ratio + Expense Ratio'
    },
    {
      id: 'loss-ratio',
      name: 'Loss Ratio',
      value: '62.5%',
      trend: '-1.5%',
      status: 'healthy',
      icon: TrendingUp,
      color: 'green',
      description: 'Claims / Premiums'
    }
  ];

  const modules = [
    {
      title: 'Solvency II',
      icon: Shield,
      color: 'purple',
      metrics: ['SCR', 'MCR', 'Own Funds', 'Risk Margin'],
      description: 'Conformité réglementaire Solvency II'
    },
    {
      title: 'Actuarial Analytics',
      icon: Calculator,
      color: 'blue',
      metrics: ['Reserves', 'Triangles', 'Projections'],
      description: 'Analyses actuarielles et projections'
    },
    {
      title: 'Claims & Underwriting',
      icon: FileCheck,
      color: 'green',
      metrics: ['Fraud Detection', 'Pricing', 'Loss Ratio'],
      description: 'Gestion des sinistres et souscription'
    }
  ];

  const getColorClasses = (color: string, type: 'text' | 'bg' | 'border') => {
    const colors = {
      purple: {
        text: 'text-purple-600',
        bg: darkMode ? 'bg-purple-900/20' : 'bg-purple-50',
        border: 'border-purple-500'
      },
      blue: {
        text: 'text-blue-600',
        bg: darkMode ? 'bg-blue-900/20' : 'bg-blue-50',
        border: 'border-blue-500'
      },
      green: {
        text: 'text-green-600',
        bg: darkMode ? 'bg-green-900/20' : 'bg-green-50',
        border: 'border-green-500'
      }
    };
    return colors[color]?.[type] || '';
  };

  const solvencyDetails = {
    'scr-coverage': {
      components: [
        { name: 'Market Risk', value: '180M€', percentage: 40 },
        { name: 'Underwriting Risk', value: '150M€', percentage: 33 },
        { name: 'Credit Risk', value: '120M€', percentage: 27 }
      ],
      totalSCR: '450M€',
      ownFunds: '832M€'
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Insurance Core Module
          </h1>
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('insurance.subtitle', 'Solvency II, métriques techniques et gestion des risques d\'assurance')}
          </p>
        </div>

        <div className="mb-8">
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t('insurance.kpis', 'Indicateurs clés Solvency II')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insuranceMetrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div
                  key={metric.id}
                  onClick={() => setSelectedMetric(selectedMetric === metric.id ? null : metric.id)}
                  className={`rounded-xl p-6 cursor-pointer transition-all ${
                    darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:shadow-lg'
                  } ${selectedMetric === metric.id ? 'ring-2 ring-indigo-500' : ''}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${getColorClasses(metric.color, 'bg')}`}>
                      <Icon className={`h-6 w-6 ${getColorClasses(metric.color, 'text')}`} />
                    </div>
                    {metric.status === 'healthy' && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {t('status.compliant', 'Conforme')}
                      </span>
                    )}
                  </div>
                  
                  <h3 className={`text-lg font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {metric.name}
                  </h3>
                  <p className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {metric.value}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {metric.description}
                    </p>
                    <div className={`flex items-center text-sm ${
                      metric.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.trend.startsWith('+') ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                      <span className="ml-1">{metric.trend}</span>
                    </div>
                  </div>

                  {selectedMetric === metric.id && metric.id === 'scr-coverage' && (
                    <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Own Funds</span>
                          <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {solvencyDetails[metric.id].ownFunds}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>SCR Total</span>
                          <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {solvencyDetails[metric.id].totalSCR}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {insuranceMetrics.some(m => parseFloat(m.value) < 100 && m.id.includes('scr')) && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            darkMode ? 'bg-yellow-900/20 border-yellow-800' : 'bg-yellow-50 border-yellow-200'
          } border`}>
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
            <div>
              <p className={`font-medium ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                {t('insurance.alert.title', 'Vigilance réglementaire')}
              </p>
              <p className={`text-sm mt-1 ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                {t('insurance.alert.message', 'Tous les ratios Solvency II sont conformes')}
              </p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => {
            const Icon = module.icon;
            return (
              <div 
                key={index}
                className={`rounded-xl p-6 transition-all hover:shadow-lg cursor-pointer ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <Icon className={`h-8 w-8 mb-4 ${getColorClasses(module.color, 'text')}`} />
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {module.title}
                </h3>
                <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {module.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {module.metrics.map((metric, idx) => (
                    <span
                      key={idx}
                      className={`text-xs px-2 py-1 rounded-full ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {metric}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions rapides - NOUVEAU */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className={`p-4 rounded-xl border-2 border-dashed transition-all ${
            darkMode 
              ? 'border-gray-700 hover:border-indigo-600 hover:bg-gray-800' 
              : 'border-gray-300 hover:border-indigo-500 hover:bg-gray-50'
          }`}>
            <FileCheck className={`h-6 w-6 mb-2 mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            <p className={`text-center font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('insurance.generateQRT', 'Générer QRT Solvency II')}
            </p>
          </button>

          <button className={`p-4 rounded-xl border-2 border-dashed transition-all ${
            darkMode 
              ? 'border-gray-700 hover:border-indigo-600 hover:bg-gray-800' 
              : 'border-gray-300 hover:border-indigo-500 hover:bg-gray-50'
          }`}>
            <Activity className={`h-6 w-6 mb-2 mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            <p className={`text-center font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('insurance.runORSA', 'Lancer analyse ORSA')}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
