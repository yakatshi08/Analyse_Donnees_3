import React from 'react';
import { 
  LayoutDashboard, Building2, Shield, Bot, BarChart3, 
  AlertTriangle, FileText, Settings, Upload,
  TrendingUp, Calculator, Brain // AJOUT de l'icône Brain
} from 'lucide-react';
import { useStore } from '../store';
import { useTranslation } from '../hooks/useTranslation';

export const ModuleNavigation: React.FC = () => {
  const { darkMode, selectedModule, setSelectedModule, selectedSector } = useStore();
  const { t } = useTranslation();

  const navigationItems = [
    {
      id: 'dashboard',
      label: t('nav.dashboard'),
      icon: LayoutDashboard
    },
    {
      id: 'import',
      label: t('nav.import'),
      icon: Upload
    },
    {
      id: 'banking',
      label: t('nav.bankingCore'),
      icon: Building2,
      sector: 'banking'
    },
    {
      id: 'credit-risk',
      label: 'Credit Risk',
      icon: AlertTriangle,
      sector: 'banking'
    },
    {
      id: 'insurance',
      label: t('nav.insuranceCore'),
      icon: Shield,
      sector: 'insurance'
    },
    {
      id: 'copilot',
      label: t('nav.coPilot'),
      icon: Bot
    },
    // REMPLACEMENT: Ancien analytics -> Nouveau analytics-ml
    {
      id: 'analytics-ml', // ID modifié
      label: t('nav.analyticsML'), // Label modifié
      icon: Brain // Icône modifiée
    },
    {
      id: 'risk',
      label: t('nav.risk'),
      icon: AlertTriangle
    },
    {
      id: 'reports',
      label: t('nav.reports'),
      icon: FileText
    },
    {
      id: 'settings',
      label: t('nav.settings'),
      icon: Settings
    }
  ];

  // Filtrer par secteur
  const filteredItems = navigationItems.filter(item => {
    if (selectedSector === 'all') return true;
    if (!item.sector) return true;
    return item.sector === selectedSector;
  });

  return (
    <nav className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 overflow-x-auto py-3">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedModule(item.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                ${selectedModule === item.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : darkMode
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};