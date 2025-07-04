import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Types pour les données financières
interface MarketData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface QuarterlyData {
  quarter: string;
  revenu: number;
  couts: number;
  profit: number;
}

interface WaterfallData {
  name: string;
  value: number;
  type: 'initial' | 'increase' | 'decrease' | 'total';
}

interface KPIData {
  label: string;
  value: string;
  target: string;
  status: 'good' | 'warning' | 'danger';
  trend?: number; // Pourcentage de variation
}

interface CorrelationData {
  assets: string[];
  matrix: number[][];
}

interface DashboardMetric {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
}

// Interface du store
interface FinanceStore {
  // État global
  isDarkMode: boolean;
  activeTab: string;
  isLoading: boolean;
  lastUpdate: Date | null;
  
  // Données de marché
  marketData: MarketData[];
  correlationData: CorrelationData;
  
  // Données trimestrielles
  quarterlyData: QuarterlyData[];
  waterfallData: WaterfallData[];
  
  // KPIs bancaires
  kpis: KPIData[];
  dashboardMetrics: DashboardMetric[];
  
  // Données temps réel (préparation)
  realtimeEnabled: boolean;
  streamingData: any[];
  
  // Actions
  setDarkMode: (isDark: boolean) => void;
  setActiveTab: (tab: string) => void;
  setLoading: (loading: boolean) => void;
  
  // Actions pour les données
  updateMarketData: (data: MarketData[]) => void;
  updateQuarterlyData: (data: QuarterlyData[]) => void;
  updateKPIs: (kpis: KPIData[]) => void;
  
  // Actions temps réel
  toggleRealtimeMode: () => void;
  addStreamingData: (data: any) => void;
  
  // Simulation et prédictions
  simulateBudget: (years: number) => Promise<any>;
  calculateRiskMetrics: () => Promise<any>;
  
  // Réinitialisation
  resetStore: () => void;
}

// Données initiales
const initialMarketData: MarketData[] = [
  { date: '2024-01-01', open: 116.0, high: 117.0, low: 115.8, close: 116.5 },
  { date: '2024-01-02', open: 116.5, high: 117.5, low: 116.5, close: 117.2 },
  { date: '2024-01-03', open: 117.2, high: 117.3, low: 116.2, close: 116.8 },
  { date: '2024-01-04', open: 116.8, high: 118.8, low: 117.5, close: 118.3 },
  { date: '2024-01-05', open: 118.3, high: 119.5, low: 118.2, close: 119.1 },
  { date: '2024-01-08', open: 119.1, high: 119.2, low: 118.0, close: 118.7 },
  { date: '2024-01-09', open: 118.7, high: 120.0, low: 118.8, close: 119.5 },
  { date: '2024-01-10', open: 119.5, high: 120.5, low: 119.5, close: 120.2 },
  { date: '2024-01-11', open: 120.2, high: 120.3, low: 119.2, close: 119.8 },
  { date: '2024-01-12', open: 119.8, high: 121.5, low: 120.2, close: 121.0 }
];

const initialQuarterlyData: QuarterlyData[] = [
  { quarter: 'Q1', revenu: 120000, couts: 80000, profit: 40000 },
  { quarter: 'Q2', revenu: 150000, couts: 90000, profit: 60000 },
  { quarter: 'Q3', revenu: 180000, couts: 100000, profit: 80000 },
  { quarter: 'Q4', revenu: 200000, couts: 110000, profit: 90000 }
];

const initialWaterfallData: WaterfallData[] = [
  { name: 'Revenu Q4 2023', value: 2500000, type: 'initial' },
  { name: 'Nouveaux clients', value: 450000, type: 'increase' },
  { name: 'Expansion clients', value: 320000, type: 'increase' },
  { name: 'Churn', value: -180000, type: 'decrease' },
  { name: 'Ajustements prix', value: 150000, type: 'increase' },
  { name: 'Revenu Q1 2024', value: 3240000, type: 'total' }
];

const initialKPIs: KPIData[] = [
  { label: 'CET1 Ratio', value: '14.5%', target: '> 13%', status: 'good', trend: 0.3 },
  { label: 'LCR', value: '135%', target: '> 100%', status: 'good', trend: 2.1 },
  { label: 'NPL Ratio', value: '3.2%', target: '< 5%', status: 'good', trend: -0.4 },
  { label: 'ROE', value: '8.7%', target: '> 10%', status: 'warning', trend: -0.8 }
];

const initialDashboardMetrics: DashboardMetric[] = [
  { title: 'Revenu Total', value: '€3.24M', change: 29.6, trend: 'up' },
  { title: 'Nouveaux Clients', value: '847', change: 15.3, trend: 'up' },
  { title: 'Taux de Rétention', value: '92.8%', change: -2.1, trend: 'down' },
  { title: 'Marge Nette', value: '23.4%', change: 1.2, trend: 'up' }
];

// Création du store avec persist pour la sauvegarde locale
export const useFinanceStore = create<FinanceStore>()(
  devtools(
    persist(
      (set, get) => ({
        // État initial
        isDarkMode: true,
        activeTab: 'dashboard',
        isLoading: false,
        lastUpdate: new Date(),
        
        // Données initiales
        marketData: initialMarketData,
        correlationData: {
          assets: ['CAC 40', 'S&P 500', 'EUR/USD', 'Gold', 'Oil'],
          matrix: [
            [1.00, 0.85, -0.60, 0.45, 0.72],
            [0.85, 1.00, -0.45, 0.38, 0.68],
            [-0.60, -0.45, 1.00, -0.35, -0.52],
            [0.45, 0.38, -0.35, 1.00, 0.42],
            [0.72, 0.68, -0.52, 0.42, 1.00]
          ]
        },
        quarterlyData: initialQuarterlyData,
        waterfallData: initialWaterfallData,
        kpis: initialKPIs,
        dashboardMetrics: initialDashboardMetrics,
        
        // Temps réel
        realtimeEnabled: false,
        streamingData: [],
        
        // Actions simples
        setDarkMode: (isDark) => set({ isDarkMode: isDark }),
        setActiveTab: (tab) => set({ activeTab: tab }),
        setLoading: (loading) => set({ isLoading: loading }),
        
        // Actions pour les données
        updateMarketData: (data) => set({ 
          marketData: data, 
          lastUpdate: new Date() 
        }),
        
        updateQuarterlyData: (data) => set({ 
          quarterlyData: data,
          lastUpdate: new Date()
        }),
        
        updateKPIs: (kpis) => set({ 
          kpis,
          lastUpdate: new Date()
        }),
        
        // Actions temps réel
        toggleRealtimeMode: () => set((state) => ({ 
          realtimeEnabled: !state.realtimeEnabled 
        })),
        
        addStreamingData: (data) => set((state) => ({
          streamingData: [...state.streamingData.slice(-99), data] // Garde les 100 derniers
        })),
        
        // Simulations complexes
        simulateBudget: async (years) => {
          set({ isLoading: true });
          
          // Simulation simple pour l'instant
          const currentRevenue = 3240000;
          const growthRate = 0.15; // 15% de croissance annuelle
          const projections = [];
          
          for (let i = 1; i <= years; i++) {
            projections.push({
              year: 2024 + i,
              revenue: currentRevenue * Math.pow(1 + growthRate, i),
              costs: currentRevenue * Math.pow(1 + growthRate, i) * 0.7,
              profit: currentRevenue * Math.pow(1 + growthRate, i) * 0.3
            });
          }
          
          set({ isLoading: false });
          return projections;
        },
        
        calculateRiskMetrics: async () => {
          set({ isLoading: true });
          
          // Calculs de base pour VaR et autres métriques
          const marketData = get().marketData;
          const returns = marketData.slice(1).map((d, i) => 
            (d.close - marketData[i].close) / marketData[i].close
          );
          
          const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
          const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
          const stdDev = Math.sqrt(variance);
          
          const VaR95 = avgReturn - 1.645 * stdDev;
          const CVaR95 = avgReturn - 2.063 * stdDev;
          
          set({ isLoading: false });
          
          return {
            VaR95: (VaR95 * 100).toFixed(2) + '%',
            CVaR95: (CVaR95 * 100).toFixed(2) + '%',
            volatility: (stdDev * 100).toFixed(2) + '%',
            sharpeRatio: (avgReturn / stdDev).toFixed(2)
          };
        },
        
        // Réinitialisation
        resetStore: () => set({
          isDarkMode: true,
          activeTab: 'dashboard',
          isLoading: false,
          lastUpdate: new Date(),
          marketData: initialMarketData,
          quarterlyData: initialQuarterlyData,
          waterfallData: initialWaterfallData,
          kpis: initialKPIs,
          dashboardMetrics: initialDashboardMetrics,
          realtimeEnabled: false,
          streamingData: []
        })
      }),
      {
        name: 'fintech-analytics-storage',
        partialize: (state) => ({ 
          isDarkMode: state.isDarkMode,
          activeTab: state.activeTab
        })
      }
    )
  )
);

// Sélecteurs personnalisés pour optimiser les re-renders
export const useMarketData = () => useFinanceStore((state) => state.marketData);
export const useKPIs = () => useFinanceStore((state) => state.kpis);
export const useDashboardMetrics = () => useFinanceStore((state) => state.dashboardMetrics);
export const useTheme = () => useFinanceStore((state) => ({ 
  isDarkMode: state.isDarkMode, 
  setDarkMode: state.setDarkMode 
}));