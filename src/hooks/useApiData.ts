import { useEffect, useState } from 'react';
import { useFinanceStore } from '../store';
import dashboardService from '../services/dashboard.service';
import { handleApiError } from '../services/api';

export const useApiData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    updateMarketData,
    updateKPIs,
    updateQuarterlyData,
    setLoading
  } = useFinanceStore();

  // Charger les données du dashboard
  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setLoading(true);

      const dashboardData = await dashboardService.getDashboardData();
      
      // Transformer et mettre à jour les données de marché
      if (dashboardData.market_data && dashboardData.market_data.length > 0) {
        const transformedMarketData = dashboardService.transformMarketDataForStore(dashboardData.market_data);
        updateMarketData(transformedMarketData);
      }

      // Transformer et mettre à jour les KPIs
      if (dashboardData.kpis && dashboardData.kpis.length > 0) {
        const transformedKPIs = dashboardService.transformKPIsForStore(dashboardData.kpis);
        updateKPIs(transformedKPIs);
      }

    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      console.error('Erreur lors du chargement des données:', apiError);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  // Charger les données waterfall
  const loadWaterfallData = async () => {
    try {
      const waterfallData = await dashboardService.getWaterfallData();
      const store = useFinanceStore.getState();
      
      // Mettre à jour le store avec les données waterfall
      store.waterfallData = dashboardService.transformWaterfallForStore(waterfallData);
      
    } catch (err) {
      const apiError = handleApiError(err);
      console.error('Erreur lors du chargement des données waterfall:', apiError);
    }
  };

  // Charger les données de corrélation
  const loadCorrelationData = async () => {
    try {
      const correlationData = await dashboardService.getCorrelationData();
      const store = useFinanceStore.getState();
      
      // Mettre à jour le store avec les données de corrélation
      store.correlationData = correlationData;
      
    } catch (err) {
      const apiError = handleApiError(err);
      console.error('Erreur lors du chargement des données de corrélation:', apiError);
    }
  };

  // Charger toutes les données au montage
  useEffect(() => {
    loadDashboardData();
    loadWaterfallData();
    loadCorrelationData();
  }, []);

  // Fonction de rafraîchissement manuel
  const refresh = async () => {
    await loadDashboardData();
    await loadWaterfallData();
    await loadCorrelationData();
  };

  return {
    isLoading,
    error,
    refresh
  };
};

// Hook pour le polling temps réel
export const useRealtimeData = (intervalMs: number = 30000) => {
  const { refresh } = useApiData();

  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs, refresh]);
};