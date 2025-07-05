// Fichier: C:\PROJETS-DEVELOPPEMENT\Analyse_Donnees_CLEAN\project\src\store.ts

import React from 'react';
import { create } from 'zustand';

// Types pour votre store existant
interface QuarterlyData {
  quarter?: string;
  revenue?: number;
  revenu?: number;
  costs?: number;
  couts?: number;
  profit?: number;
}

interface KPI {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'stable';
  color?: string;
}

interface FinanceStore {
  // États existants de votre Dashboard
  isDarkMode: boolean;
  apiConnected: boolean;
  quarterlyData: QuarterlyData[];
  kpis: KPI[];
  
  // Nouveaux états pour les fonctionnalités du cahier des charges
  selectedSector: 'banking' | 'insurance' | 'all';
  userProfile: 'banker' | 'actuary' | 'risk_manager' | 'cfo';
  
  // Actions
  toggleDarkMode: () => void;
  setApiConnected: (connected: boolean) => void;
  setQuarterlyData: (data: QuarterlyData[]) => void;
  setKpis: (kpis: KPI[]) => void;
  setSelectedSector: (sector: 'banking' | 'insurance' | 'all') => void;
  setUserProfile: (profile: 'banker' | 'actuary' | 'risk_manager' | 'cfo') => void;
  
  // Actions pour charger les données depuis l'API
  fetchDashboardData: () => Promise<void>;
  fetchBankingData: () => Promise<void>;
  fetchInsuranceData: () => Promise<void>;
}

export const useFinanceStore = create<FinanceStore>((set, get) => ({
  // États initiaux
  isDarkMode: false,
  apiConnected: false,
  selectedSector: 'all',
  userProfile: 'banker',
  
  // Données par défaut pour éviter les erreurs
  quarterlyData: [
    {
      quarter: 'Q1 2024',
      revenue: 120000000,
      revenu: 120000000,
      costs: 85000000,
      couts: 85000000,
      profit: 35000000
    },
    {
      quarter: 'Q2 2024',
      revenue: 150000000,
      revenu: 150000000,
      costs: 92000000,
      couts: 92000000,
      profit: 58000000
    },
    {
      quarter: 'Q3 2024',
      revenue: 180000000,
      revenu: 180000000,
      costs: 98000000,
      couts: 98000000,
      profit: 82000000
    },
    {
      quarter: 'Q4 2024',
      revenue: 200000000,
      revenu: 200000000,
      costs: 110000000,
      couts: 110000000,
      profit: 90000000
    }
  ],
  
  kpis: [
    { label: 'NPL Ratio', value: '2.1%', trend: 'down', color: 'text-green-500' },
    { label: 'CET1 Ratio', value: '14.8%', trend: 'up', color: 'text-green-500' },
    { label: 'LCR', value: '125.5%', trend: 'up', color: 'text-green-500' },
    { label: 'ROE', value: '12.8%', trend: 'up', color: 'text-green-500' },
    { label: 'SCR Ratio', value: '168%', trend: 'up', color: 'text-green-500' },
    { label: 'Combined Ratio', value: '94.5%', trend: 'down', color: 'text-green-500' },
    { label: 'NSFR', value: '112.3%', trend: 'stable', color: 'text-blue-500' },
    { label: 'Leverage Ratio', value: '5.2%', trend: 'up', color: 'text-green-500' }
  ],

  // Actions
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  
  setApiConnected: (connected: boolean) => set({ apiConnected: connected }),
  
  setQuarterlyData: (data: QuarterlyData[]) => set({ quarterlyData: data }),
  
  setKpis: (kpis: KPI[]) => set({ kpis }),
  
  setSelectedSector: (sector) => set({ selectedSector: sector }),
  
  setUserProfile: (profile) => set({ userProfile: profile }),

  // Fonction pour charger les données depuis l'API backend
  fetchDashboardData: async () => {
    try {
      console.log('🔄 Chargement des données du dashboard...');
      
      // Appel à votre API backend existante
      const response = await fetch('http://localhost:8000/api/v1/dashboard/');
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Données reçues de l\'API:', data);
        
        // Mettre à jour le store avec les données reçues
        set({ 
          apiConnected: true,
          // Si l'API retourne des quarterlyData, les utiliser
          // Sinon garder les données par défaut
        });
        
        // Charger les données supplémentaires
        await get().fetchBankingData();
        await get().fetchInsuranceData();
        
      } else {
        console.warn('⚠️ Erreur API, utilisation des données par défaut');
        set({ apiConnected: false });
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des données:', error);
      set({ apiConnected: false });
    }
  },

  // Fonction pour charger les données bancaires
  fetchBankingData: async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/banking/');
      if (response.ok) {
        const bankingData = await response.json();
        console.log('✅ Données bancaires reçues:', bankingData);
        
        // Mettre à jour les KPIs bancaires
        const currentKpis = get().kpis;
        const updatedKpis = currentKpis.map(kpi => {
          if (bankingData.ratios) {
            switch (kpi.label) {
              case 'CET1 Ratio':
                return { ...kpi, value: `${bankingData.ratios.cet1}%` };
              case 'LCR':
                return { ...kpi, value: `${bankingData.ratios.lcr}%` };
              case 'NSFR':
                return { ...kpi, value: `${bankingData.ratios.nsfr}%` };
              case 'Leverage Ratio':
                return { ...kpi, value: `${bankingData.ratios.leverage}%` };
              default:
                return kpi;
            }
          }
          return kpi;
        });
        
        set({ kpis: updatedKpis });
      }
    } catch (error) {
      console.error('❌ Erreur chargement données bancaires:', error);
    }
  },

  // Fonction pour charger les données assurance
  fetchInsuranceData: async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/insurance/');
      if (response.ok) {
        const insuranceData = await response.json();
        console.log('✅ Données assurance reçues:', insuranceData);
        // Logique similaire pour mettre à jour les KPIs assurance
      }
    } catch (error) {
      console.error('❌ Erreur chargement données assurance:', error);
    }
  }
}));

// Hook pour initialiser les données au démarrage
export const useInitializeStore = () => {
  const fetchDashboardData = useFinanceStore(state => state.fetchDashboardData);
  
  // Charger les données au démarrage
  React.useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);
};

// Export du store pour debug (comme dans votre code)
if (typeof window !== 'undefined') {
  (window as any).financeStore = useFinanceStore;
}