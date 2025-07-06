import React from 'react';
import { Shield, Calculator, FileCheck, Activity } from 'lucide-react';
import { useStore } from '../store';

export const InsuranceCore: React.FC = () => {
  const { darkMode } = useStore();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Insurance Core Module
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder cards pour les fonctionnalités Insurance */}
          <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <Shield className="h-8 w-8 text-purple-600 mb-4" />
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Solvency II
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              SCR, MCR, Own Funds, Risk Margin
            </p>
          </div>
          
          <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <Calculator className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Actuarial Analytics
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Reserves, Triangles, Projections
            </p>
          </div>
          
          <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <FileCheck className="h-8 w-8 text-green-600 mb-4" />
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Claims & Underwriting
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Fraud Detection, Pricing, Loss Ratio
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};