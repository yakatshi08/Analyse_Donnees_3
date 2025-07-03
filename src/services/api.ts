// api.ts - Service complet pour communiquer avec le backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Helper pour les requêtes avec gestion d'erreur améliorée
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('access_token');
  
  const headers = {
    ...options.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  // Ne pas définir Content-Type pour FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    // Gérer les erreurs HTTP
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    // Gérer les réponses vides
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return response;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Services pour le Dashboard
export const dashboardService = {
  getMetrics: async () => {
    try {
      return await fetchWithAuth('/dashboard/metrics');
    } catch (error) {
      console.error('Erreur getMetrics:', error);
      return {
        npl_ratio: 2.8,
        cet1_ratio: 15.5,
        lcr: 142,
        roe: 12.3
      };
    }
  },

  getRiskMetrics: async () => {
    try {
      return await fetchWithAuth('/dashboard/risk-metrics');
    } catch (error) {
      console.error('Erreur getRiskMetrics:', error);
      return {
        portfolio_evolution: [],
        risk_indicators: []
      };
    }
  },

  getHistoricalData: async (period: string = '7d') => {
    try {
      return await fetchWithAuth(`/dashboard/historical?period=${period}`);
    } catch (error) {
      console.error('Erreur getHistoricalData:', error);
      return { data: [] };
    }
  }
};

// Services pour l'authentification
export const authService = {
  login: async (email: string, password: string) => {
    const response = await fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: email,
        password: password
      })
    });
    
    if (response.access_token) {
      localStorage.setItem('access_token', response.access_token);
    }
    
    return response;
  },

  logout: async () => {
    await fetchWithAuth('/auth/logout', { method: 'POST' });
    localStorage.removeItem('access_token');
  },

  getCurrentUser: async () => {
    return await fetchWithAuth('/auth/me');
  },

  register: async (userData: any) => {
    return await fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }
};

// Services pour les datasets - NOUVEAU
export const datasetService = {
  // Liste des datasets
  list: async (filters?: { dataset_type?: string; validated_only?: boolean }) => {
    const params = new URLSearchParams();
    if (filters?.dataset_type) params.append('dataset_type', filters.dataset_type);
    if (filters?.validated_only) params.append('validated_only', String(filters.validated_only));
    
    const queryString = params.toString();
    const url = queryString ? `/datasets?${queryString}` : '/datasets';
    
    return await fetchWithAuth(url);
  },

  // Upload d'un dataset
  upload: async (file: File, metadata: {
    name: string;
    dataset_type: string;
    validate_ifrs9?: boolean;
    anonymize_gdpr?: boolean;
  }) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Ajouter les métadonnées comme query params
    const params = new URLSearchParams({
      name: metadata.name,
      dataset_type: metadata.dataset_type,
      validate_ifrs9: String(metadata.validate_ifrs9 ?? true),
      anonymize_gdpr: String(metadata.anonymize_gdpr ?? true)
    });

    return await fetchWithAuth(`/datasets/upload?${params}`, {
      method: 'POST',
      body: formData
    });
  },

  // Preview d'un dataset
  preview: async (datasetId: string, rows: number = 10) => {
    return await fetchWithAuth(`/datasets/${datasetId}/preview?rows=${rows}`);
  },

  // Valider un dataset
  validate: async (datasetId: string, validationType: string) => {
    return await fetchWithAuth(`/datasets/${datasetId}/validate?validation_type=${validationType}`, {
      method: 'POST'
    });
  },

  // Obtenir la traçabilité
  getLineage: async (datasetId: string) => {
    return await fetchWithAuth(`/datasets/${datasetId}/lineage`);
  },

  // Transformer un dataset
  transform: async (datasetId: string, transformation: any) => {
    return await fetchWithAuth(`/datasets/${datasetId}/transform`, {
      method: 'POST',
      body: JSON.stringify(transformation)
    });
  },

  // Supprimer un dataset
  delete: async (datasetId: string) => {
    return await fetchWithAuth(`/datasets/${datasetId}`, {
      method: 'DELETE'
    });
  },

  // Rapport de qualité
  getQualityReport: async (datasetId: string) => {
    return await fetchWithAuth(`/datasets/${datasetId}/quality-report`);
  }
};

// Services pour les analyses
export const analysisService = {
  // EDA intelligent
  runEDA: async (datasetId: string, autoDetectPatterns: boolean = true) => {
    return await fetchWithAuth('/analysis/eda', {
      method: 'POST',
      body: JSON.stringify({
        dataset_id: datasetId,
        auto_detect_patterns: autoDetectPatterns
      })
    });
  },

  // Analyse de cohortes
  runCohortAnalysis: async (datasetId: string, config: any) => {
    return await fetchWithAuth('/analysis/cohort-analysis', {
      method: 'POST',
      body: JSON.stringify({
        dataset_id: datasetId,
        ...config
      })
    });
  },

  // Calcul des ratios financiers
  calculateRatios: async (datasetId: string, ratioTypes: string[]) => {
    const params = new URLSearchParams();
    ratioTypes.forEach(type => params.append('ratio_types', type));
    
    return await fetchWithAuth(`/analysis/financial-ratios?dataset_id=${datasetId}&${params}`, {
      method: 'POST'
    });
  },

  // Analyse Credit Risk
  runCreditRisk: async (datasetId: string, analysisType: string = 'full') => {
    return await fetchWithAuth(`/analysis/credit-risk?dataset_id=${datasetId}&analysis_type=${analysisType}`, {
      method: 'POST'
    });
  },

  // Stress Test
  runStressTest: async (datasetId: string, config: {
    test_type?: string;
    scenarios?: string[];
    horizon_months?: number;
  }) => {
    const params = new URLSearchParams({
      dataset_id: datasetId,
      test_type: config.test_type || 'bce',
      horizon_months: String(config.horizon_months || 36)
    });
    
    if (config.scenarios) {
      config.scenarios.forEach(s => params.append('scenarios', s));
    }

    return await fetchWithAuth(`/analysis/stress-test?${params}`, {
      method: 'POST'
    });
  },

  // Analyse Liquidité
  runLiquidityAnalysis: async (datasetId: string, analysisDate?: Date) => {
    const params = new URLSearchParams({ dataset_id: datasetId });
    if (analysisDate) {
      params.append('analysis_date', analysisDate.toISOString());
    }

    return await fetchWithAuth(`/analysis/liquidity-alm?${params}`, {
      method: 'POST'
    });
  },

  // Analyse Market Risk
  runMarketRisk: async (datasetId: string, config: {
    risk_measures?: string[];
    confidence_levels?: number[];
  }) => {
    const params = new URLSearchParams({ dataset_id: datasetId });
    
    if (config.risk_measures) {
      config.risk_measures.forEach(m => params.append('risk_measures', m));
    }
    if (config.confidence_levels) {
      config.confidence_levels.forEach(l => params.append('confidence_levels', String(l)));
    }

    return await fetchWithAuth(`/analysis/market-risk?${params}`, {
      method: 'POST'
    });
  },

  // Benchmarks sectoriels
  getBenchmarks: async (sector: string, metrics?: string[]) => {
    const params = new URLSearchParams({ sector });
    if (metrics) {
      metrics.forEach(m => params.append('metrics', m));
    }

    return await fetchWithAuth(`/analysis/benchmarks/${sector}?${params}`);
  }
};

// Services pour les prédictions
export const predictionService = {
  // Entraîner un modèle AutoML
  trainModel: async (config: {
    dataset_id: string;
    target_column: string;
    model_type: string;
    task_type: string;
    optimization_metric?: string;
  }) => {
    return await fetchWithAuth('/predictions/automl/train', {
      method: 'POST',
      body: JSON.stringify(config)
    });
  },

  // Génération de dashboard via NLP
  generateDashboardNLP: async (query: string, datasetId?: string) => {
    return await fetchWithAuth('/predictions/nlp-dashboard', {
      method: 'POST',
      body: JSON.stringify({
        query,
        dataset_id: datasetId
      })
    });
  },

  // Configuration des alertes
  configureAlerts: async (config: any) => {
    return await fetchWithAuth('/predictions/risk-alerts/configure', {
      method: 'POST',
      body: JSON.stringify(config)
    });
  },

  // Détection d'anomalies
  detectAnomalies: async (datasetId: string, config: {
    detection_methods?: string[];
    sensitivity?: number;
  }) => {
    const params = new URLSearchParams({ dataset_id: datasetId });
    
    if (config.detection_methods) {
      config.detection_methods.forEach(m => params.append('detection_methods', m));
    }
    if (config.sensitivity) {
      params.append('sensitivity', String(config.sensitivity));
    }

    return await fetchWithAuth(`/predictions/anomaly-detection?${params}`, {
      method: 'POST'
    });
  },

  // Faire une prédiction
  predict: async (modelId: string, data: any, returnProbabilities: boolean = false) => {
    return await fetchWithAuth('/predictions/predict', {
      method: 'POST',
      body: JSON.stringify({
        model_id: modelId,
        data,
        return_probabilities: returnProbabilities
      })
    });
  },

  // Liste des modèles
  listModels: async (filters?: { model_type?: string; status?: string }) => {
    const params = new URLSearchParams();
    if (filters?.model_type) params.append('model_type', filters.model_type);
    if (filters?.status) params.append('status', filters.status);
    
    const queryString = params.toString();
    const url = queryString ? `/predictions/models?${queryString}` : '/predictions/models';
    
    return await fetchWithAuth(url);
  },

  // Statut d'entraînement
  getTrainingStatus: async (jobId: string) => {
    return await fetchWithAuth(`/predictions/training/${jobId}/status`);
  },

  // Retraining d'un modèle
  retrainModel: async (modelId: string, newDataId?: string) => {
    const body = newDataId ? { new_data_id: newDataId } : {};
    
    return await fetchWithAuth(`/predictions/models/${modelId}/retrain`, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  // Explicabilité du modèle
  explainModel: async (modelId: string, sampleData?: any) => {
    const params = sampleData ? `?sample_data=${JSON.stringify(sampleData)}` : '';
    return await fetchWithAuth(`/predictions/models/${modelId}/explain${params}`);
  }
};

// Services pour les rapports
export const reportService = {
  // Générer un rapport
  generate: async (config: {
    report_type: string;
    dataset_ids: string[];
    period_start: Date;
    period_end: Date;
    parameters?: any;
    blockchain_audit?: boolean;
  }) => {
    return await fetchWithAuth('/reports/generate', {
      method: 'POST',
      body: JSON.stringify({
        ...config,
        period_start: config.period_start.toISOString(),
        period_end: config.period_end.toISOString()
      })
    });
  },

  // Liste des templates
  listTemplates: async (category?: string) => {
    const url = category ? `/reports/templates?category=${category}` : '/reports/templates';
    return await fetchWithAuth(url);
  },

  // Dashboard de conformité
  getComplianceDashboard: async (reportingDate?: Date) => {
    const params = reportingDate 
      ? `?reporting_date=${reportingDate.toISOString()}`
      : '';
    
    return await fetchWithAuth(`/reports/compliance-dashboard${params}`);
  },

  // Télécharger un rapport
  download: async (reportId: string, format: string = 'pdf') => {
    const response = await fetchWithAuth(`/reports/${reportId}/download?format=${format}`);
    
    // Gérer le téléchargement du fichier
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${reportId}.${format}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  // Historique d'audit
  getAuditTrail: async (filters?: {
    start_date?: Date;
    end_date?: Date;
    report_type?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append('start_date', filters.start_date.toISOString());
    if (filters?.end_date) params.append('end_date', filters.end_date.toISOString());
    if (filters?.report_type) params.append('report_type', filters.report_type);
    
    const queryString = params.toString();
    const url = queryString ? `/reports/audit-trail?${queryString}` : '/reports/audit-trail';
    
    return await fetchWithAuth(url);
  },

  // Planifier un rapport
  schedule: async (config: any) => {
    return await fetchWithAuth('/reports/schedule', {
      method: 'POST',
      body: JSON.stringify(config)
    });
  },

  // Valider un rapport
  validate: async (reportId: string, validationLevel: string = 'full') => {
    return await fetchWithAuth(`/reports/validate/${reportId}?validation_level=${validationLevel}`, {
      method: 'POST'
    });
  },

  // Calendrier réglementaire
  getRegulatoryCalendar: async (year?: number) => {
    const url = year ? `/reports/regulatory-calendar?year=${year}` : '/reports/regulatory-calendar';
    return await fetchWithAuth(url);
  },

  // Résumé exécutif
  generateExecutiveSummary: async (datasetIds: string[], period: string = 'monthly') => {
    return await fetchWithAuth(`/reports/executive-summary?period=${period}`, {
      method: 'POST',
      body: JSON.stringify({ dataset_ids: datasetIds })
    });
  }
};

export default {
  dashboardService,
  authService,
  datasetService,
  analysisService,
  predictionService,
  reportService
};