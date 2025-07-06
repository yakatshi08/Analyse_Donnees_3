import React from 'react';
import { Building2, TrendingUp, Activity, DollarSign, AlertCircle } from 'lucide-react';
import { useStore } from '../store';

export const BankingCore: React.FC = () => {
  const { darkMode } = useStore();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Banking Core Module
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder cards pour les fonctionnalités Banking */}
          <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <Building2 className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Ratios Bâle III
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              CET1, LCR, NSFR, Leverage Ratio
            </p>
          </div>
          
          <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <TrendingUp className="h-8 w-8 text-green-600 mb-4" />
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Credit Risk
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              PD, LGD, EAD, Stress Testing
            </p>
          </div>
          
          <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <Activity className="h-8 w-8 text-purple-600 mb-4" />
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              ALM & Liquidity
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Gap Analysis, Duration, Convexity
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};