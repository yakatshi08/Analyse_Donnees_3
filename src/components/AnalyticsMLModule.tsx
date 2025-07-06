import React, { useState, useEffect } from 'react';
import { 
  Brain, TrendingUp, AlertTriangle, BarChart3, 
  Activity, Zap, Target, RefreshCw, Download,
  Play, Settings, Info, ChevronRight
} from 'lucide-react';
import { useStore } from '../store';
import { useTranslation } from '../hooks/useTranslation';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, Scatter
} from 'recharts';

interface Prediction {
  date: string;
  value: number;
  lowerBound?: number;
  upperBound?: number;
}

interface Anomaly {
  timestamp: string;
  metric: string;
  value: number;
  expected_value: number;
  deviation: number;
  severity: string;
  confidence: number;
  explanation: string;
}

type TabType = 'predictions' | 'anomalies' | 'automl' | 'scenarios';

export const AnalyticsMLModule: React.FC = () => {
  const { darkMode } = useStore();
  const { t } = useTranslation();
  
  // States
  const [activeTab, setActiveTab] = useState<TabType>('predictions');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Predictions states
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [selectedModel, setSelectedModel] = useState('auto');
  const [horizon, setHorizon] = useState(30);
  const [predictions, setPredictions] = useState<any>(null);
  
  // Anomalies states
  const [anomaliesData, setAnomaliesData] = useState<Anomaly[]>([]);
  const [sensitivity, setSensitivity] = useState(0.95);
  
  // AutoML states
  const [automlResults, setAutomlResults] = useState<any>(null);
  const [targetMetric, setTargetMetric] = useState('profit');
  const [features, setFeatures] = useState<string[]>(['revenue', 'costs', 'volume']);
  
  // Scenarios states
  const [scenarios, setScenarios] = useState({
    optimistic: { revenue: 0.1, costs: -0.05 },
    baseline: { revenue: 0, costs: 0 },
    pessimistic: { revenue: -0.1, costs: 0.1 }
  });
  const [scenarioResults, setScenarioResults] = useState<any>(null);

  // Données simulées
  const historicalData = generateHistoricalData();
  
  // Options
  const metrics = [
    { value: 'revenue', label: 'Revenus', icon: TrendingUp },
    { value: 'costs', label: 'Coûts', icon: Activity },
    { value: 'profit', label: 'Bénéfices', icon: BarChart3 },
    { value: 'npl_ratio', label: 'Ratio NPL', icon: AlertTriangle }
  ];
  
  const models = [
    { value: 'auto', label: 'Sélection automatique' },
    { value: 'xgboost', label: 'XGBoost' },
    { value: 'prophet', label: 'Prophet' },
    { value: 'lstm', label: 'LSTM' },
    { value: 'arima', label: 'ARIMA' }
  ];

  // Fonction pour générer des données historiques
  function generateHistoricalData() {
    const data = [];
    const today = new Date();
    
    for (let i = 365; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        revenue: 100000 + Math.random() * 20000 + (365 - i) * 100,
        costs: 80000 + Math.random() * 15000 + (365 - i) * 80,
        profit: 20000 + Math.random() * 5000 + (365 - i) * 20,
        npl_ratio: 2 + Math.random() * 0.5
      });
    }
    
    return data;
  }

  // Lancer une prédiction
  const runPrediction = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('http://localhost:8000/api/analytics-ml/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metric_name: selectedMetric,
          historical_data: historicalData.slice(-90), // 90 derniers jours
          horizon: horizon,
          model_type: selectedModel === 'auto' ? null : selectedModel,
          confidence_level: 0.95
        })
      });
      
      const data = await response.json();
      setPredictions(data);
    } catch (error) {
      console.error('Erreur prédiction:', error);
      // Données simulées en cas d'erreur
      setPredictions(generateSimulatedPredictions());
    } finally {
      setIsProcessing(false);
    }
  };

  // Détecter les anomalies
  const detectAnomalies = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('http://localhost:8000/api/analytics-ml/anomalies/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: historicalData.map(d => ({ ...d, value: d[selectedMetric] })),
          metric_name: selectedMetric,
          sensitivity: sensitivity,
          method: 'isolation_forest'
        })
      });
      
      const data = await response.json();
      setAnomaliesData(data.anomalies || []);
    } catch (error) {
      console.error('Erreur détection:', error);
      // Données simulées
      setAnomaliesData(generateSimulatedAnomalies());
    } finally {
      setIsProcessing(false);
    }
  };

  // Lancer AutoML
  const runAutoML = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('http://localhost:8000/api/analytics-ml/automl/train', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: historicalData,
          target_metric: targetMetric,
          feature_columns: features,
          optimization_metric: 'rmse',
          time_limit: 300
        })
      });
      
      const data = await response.json();
      setAutomlResults(data);
    } catch (error) {
      console.error('Erreur AutoML:', error);
      // Résultats simulés
      setAutomlResults(generateSimulatedAutoMLResults());
    } finally {
      setIsProcessing(false);
    }
  };

  // Analyser les scénarios
  const analyzeScenarios = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('http://localhost:8000/api/analytics-ml/scenarios/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base_data: historicalData.slice(-180), // 6 derniers mois
          metric: selectedMetric,
          scenarios: scenarios,
          horizon: 90
        })
      });
      
      const data = await response.json();
      setScenarioResults(data);
    } catch (error) {
      console.error('Erreur scénarios:', error);
      // Résultats simulés
      setScenarioResults(generateSimulatedScenarios());
    } finally {
      setIsProcessing(false);
    }
  };

  // Fonctions de génération de données simulées
  function generateSimulatedPredictions() {
    const predictions = [];
    const lastValue = historicalData[historicalData.length - 1][selectedMetric];
    
    for (let i = 1; i <= horizon; i++) {
      const trend = 1 + (Math.random() - 0.5) * 0.02;
      const value = lastValue * Math.pow(trend, i);
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      predictions.push({
        date: date.toISOString().split('T')[0],
        value: value,
        lowerBound: value * 0.9,
        upperBound: value * 1.1
      });
    }
    
    return {
      predictions: {
        values: predictions.map(p => p.value),
        dates: predictions.map(p => p.date),
        confidence_intervals: predictions.map(p => [p.lowerBound, p.upperBound])
      },
      model_used: 'xgboost',
      accuracy_score: 0.87
    };
  }

  function generateSimulatedAnomalies(): Anomaly[] {
    const anomalies = [];
    const indices = [45, 123, 234, 298, 340];
    
    indices.forEach(idx => {
      if (idx < historicalData.length) {
        const data = historicalData[idx];
        anomalies.push({
          timestamp: data.date,
          metric: selectedMetric,
          value: data[selectedMetric] * 1.5,
          expected_value: data[selectedMetric],
          deviation: 0.5,
          severity: idx % 2 === 0 ? 'high' : 'medium',
          confidence: 0.85 + Math.random() * 0.15,
          explanation: `Valeur anormalement élevée détectée`
        });
      }
    });
    
    return anomalies;
  }

  function generateSimulatedAutoMLResults() {
    return {
      best_model: 'xgboost',
      best_score: 0.12,
      feature_importance: {
        'revenue': 0.45,
        'costs': 0.35,
        'volume': 0.20
      },
      backtest_results: {
        mean_score: 0.85,
        std_score: 0.05,
        n_splits: 5
      },
      recommendations: [
        "🎯 XGBoost offre les meilleures performances",
        "✅ Modèle stable avec un écart-type faible",
        "📊 Revenue est la feature la plus importante"
      ]
    };
  }

  function generateSimulatedScenarios() {
    const baseValue = historicalData[historicalData.length - 1][selectedMetric];
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 90; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return {
      predictions: {
        baseline: {
          values: dates.map((_, i) => baseValue * (1 + 0.001 * i)),
          dates: dates
        },
        optimistic: {
          values: dates.map((_, i) => baseValue * (1 + 0.003 * i)),
          dates: dates
        },
        pessimistic: {
          values: dates.map((_, i) => baseValue * (1 - 0.001 * i)),
          dates: dates
        }
      },
      risk_analysis: {
        baseline: { volatility: 1000, var_95: baseValue * 0.95 },
        optimistic: { volatility: 1200, var_95: baseValue * 0.98 },
        pessimistic: { volatility: 1500, var_95: baseValue * 0.85 }
      }
    };
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-purple-600 rounded-xl">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Analytics ML - Intelligence Artificielle
              </h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Pipeline AutoML • Prédictions avancées • Détection d'anomalies
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-200 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('predictions')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors
                ${activeTab === 'predictions'
                  ? 'bg-white dark:bg-gray-700 text-purple-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'}`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>Prédictions</span>
            </button>
            <button
              onClick={() => setActiveTab('anomalies')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors
                ${activeTab === 'anomalies'
                  ? 'bg-white dark:bg-gray-700 text-purple-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'}`}
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Anomalies</span>
            </button>
            <button
              onClick={() => setActiveTab('automl')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors
                ${activeTab === 'automl'
                  ? 'bg-white dark:bg-gray-700 text-purple-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'}`}
            >
              <Zap className="h-4 w-4" />
              <span>AutoML</span>
            </button>
            <button
              onClick={() => setActiveTab('scenarios')}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors
                ${activeTab === 'scenarios'
                  ? 'bg-white dark:bg-gray-700 text-purple-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'}`}
            >
              <Target className="h-4 w-4" />
              <span>Scénarios</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'predictions' && (
          <div className="space-y-6">
            {/* Configuration */}
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Configuration de la prédiction
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Métrique
                  </label>
                  <select
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {metrics.map(m => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Modèle
                  </label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {models.map(m => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Horizon (jours)
                  </label>
                  <input
                    type="number"
                    value={horizon}
                    onChange={(e) => setHorizon(Number(e.target.value))}
                    min="7"
                    max="365"
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={runPrediction}
                    disabled={isProcessing}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                      transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Traitement...</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        <span>Prédire</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Résultats */}
            {predictions && (
              <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Résultats de la prédiction
                  </h3>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Modèle: <span className="font-medium">{predictions.model_used}</span>
                    </span>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Précision: <span className="font-medium">{(predictions.accuracy_score * 100).toFixed(1)}%</span>
                    </span>
                  </div>
                </div>

                {/* Graphique de prédiction */}
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={formatPredictionData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                      <XAxis 
                        dataKey="date" 
                        stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                          border: 'none',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="upperBound"
                        stackId="1"
                        stroke="none"
                        fill="#8B5CF6"
                        fillOpacity={0.1}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stackId="2"
                        stroke="#8B5CF6"
                        strokeWidth={2}
                        fill="#8B5CF6"
                        fillOpacity={0.4}
                      />
                      <Area
                        type="monotone"
                        dataKey="lowerBound"
                        stackId="3"
                        stroke="none"
                        fill="#8B5CF6"
                        fillOpacity={0.1}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Feature importance */}
                {predictions.feature_importance && (
                  <div className="mt-6">
                    <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Importance des features
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(predictions.feature_importance)
                        .sort(([,a], [,b]) => (b as number) - (a as number))
                        .map(([feature, importance]) => (
                          <div key={feature} className="flex items-center space-x-3">
                            <span className={`text-sm w-24 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {feature}
                            </span>
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-purple-600 h-2 rounded-full"
                                style={{ width: `${(importance as number) * 100}%` }}
                              />
                            </div>
                            <span className={`text-sm font-medium w-12 text-right ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {((importance as number) * 100).toFixed(0)}%
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'anomalies' && (
          <div className="space-y-6">
            {/* Configuration */}
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Détection d'anomalies
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Métrique à analyser
                  </label>
                  <select
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {metrics.map(m => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Sensibilité ({(sensitivity * 100).toFixed(0)}%)
                  </label>
                  <input
                    type="range"
                    min="0.8"
                    max="0.99"
                    step="0.01"
                    value={sensitivity}
                    onChange={(e) => setSensitivity(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={detectAnomalies}
                    disabled={isProcessing}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                      transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Analyse en cours...' : 'Détecter anomalies'}
                  </button>
                </div>
              </div>
            </div>

            {/* Résultats */}
            {anomaliesData.length > 0 && (
              <>
                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {['critical', 'high', 'medium', 'low'].map(severity => {
                    const count = anomaliesData.filter(a => a.severity === severity).length;
                    return (
                      <div key={severity} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {severity.charAt(0).toUpperCase() + severity.slice(1)}
                          </span>
                          <AlertTriangle className={`h-5 w-5 ${getSeverityColor(severity)}`} />
                        </div>
                        <div className={`text-2xl font-bold mt-2 ${getSeverityColor(severity)}`}>
                          {count}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Liste des anomalies */}
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Anomalies détectées
                  </h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                          <th className="text-left py-3 px-4">Date</th>
                          <th className="text-left py-3 px-4">Métrique</th>
                          <th className="text-right py-3 px-4">Valeur</th>
                          <th className="text-right py-3 px-4">Attendu</th>
                          <th className="text-right py-3 px-4">Déviation</th>
                          <th className="text-center py-3 px-4">Sévérité</th>
                          <th className="text-left py-3 px-4">Explication</th>
                        </tr>
                      </thead>
                      <tbody>
                        {anomaliesData.slice(0, 10).map((anomaly, idx) => (
                          <tr key={idx} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <td className="py-3 px-4 text-sm">
                              {new Date(anomaly.timestamp).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 text-sm">{anomaly.metric}</td>
                            <td className="text-right py-3 px-4 text-sm font-medium">
                              {anomaly.value.toLocaleString()}
                            </td>
                            <td className="text-right py-3 px-4 text-sm">
                              {anomaly.expected_value.toLocaleString()}
                            </td>
                            <td className="text-right py-3 px-4 text-sm">
                              {(anomaly.deviation * 100).toFixed(1)}%
                            </td>
                            <td className="text-center py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                anomaly.severity === 'critical' ? 'bg-red-100 text-red-800' :
                                anomaly.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                                anomaly.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {anomaly.severity}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-500">
                              {anomaly.explanation}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'automl' && (
          <div className="space-y-6">
            {/* Configuration */}
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Pipeline AutoML
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Métrique cible
                  </label>
                  <select
                    value={targetMetric}
                    onChange={(e) => setTargetMetric(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {metrics.map(m => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Features
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {metrics.map(m => (
                      <label key={m.value} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={features.includes(m.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFeatures([...features, m.value]);
                            } else {
                              setFeatures(features.filter(f => f !== m.value));
                            }
                          }}
                          disabled={m.value === targetMetric}
                          className="rounded"
                        />
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {m.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={runAutoML}
                  disabled={isProcessing || features.length === 0}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                    transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Entraînement en cours...' : 'Lancer AutoML'}
                </button>
              </div>
            </div>

            {/* Résultats */}
            {automlResults && (
              <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Résultats AutoML
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">Meilleur modèle</span>
                      <Zap className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="text-xl font-bold text-purple-600">
                      {automlResults.best_model.toUpperCase()}
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">Score RMSE</span>
                      <Target className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="text-xl font-bold text-green-600">
                      {automlResults.best_score.toFixed(3)}
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">Stabilité</span>
                      <Activity className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-xl font-bold text-blue-600">
                      {(automlResults.backtest_results.mean_score * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Feature importance */}
                <div className="mb-6">
                  <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Importance des features
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(automlResults.feature_importance)
                      .sort(([,a], [,b]) => (b as number) - (a as number))
                      .map(([feature, importance]) => (
                        <div key={feature} className="flex items-center space-x-3">
                          <span className={`text-sm w-24 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {feature}
                          </span>
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full"
                              style={{ width: `${(importance as number) * 100}%` }}
                            />
                          </div>
                          <span className={`text-sm font-medium w-12 text-right ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {((importance as number) * 100).toFixed(0)}%
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Recommandations */}
                <div>
                  <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Recommandations
                  </h4>
                  <ul className="space-y-2">
                    {automlResults.recommendations.map((rec: string, idx: number) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <ChevronRight className="h-4 w-4 text-purple-600 mt-0.5" />
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'scenarios' && (
          <div className="space-y-6">
            {/* Configuration */}
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Analyse de scénarios
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(scenarios).map(([scenario, modifiers]) => (
                  <div key={scenario} className={`p-4 rounded-lg border ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <h3 className="font-medium mb-3 capitalize">{scenario}</h3>
                    <div className="space-y-2">
                      <div>
                        <label className="text-sm text-gray-500">Revenue</label>
                        <input
                          type="number"
                          value={modifiers.revenue * 100}
                          onChange={(e) => setScenarios({
                            ...scenarios,
                            [scenario]: {
                              ...modifiers,
                              revenue: Number(e.target.value) / 100
                            }
                          })}
                          className={`w-full px-2 py-1 rounded border text-sm ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Costs</label>
                        <input
                          type="number"
                          value={modifiers.costs * 100}
                          onChange={(e) => setScenarios({
                            ...scenarios,
                            [scenario]: {
                              ...modifiers,
                              costs: Number(e.target.value) / 100
                            }
                          })}
                          className={`w-full px-2 py-1 rounded border text-sm ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <button
                  onClick={analyzeScenarios}
                  disabled={isProcessing}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                    transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Analyse en cours...' : 'Analyser scénarios'}
                </button>
              </div>
            </div>

            {/* Résultats */}
            {scenarioResults && (
              <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Comparaison des scénarios
                </h3>

                {/* Graphique de comparaison */}
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formatScenarioData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                      <XAxis 
                        dataKey="date" 
                        stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                          border: 'none',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="baseline"
                        stroke="#6B7280"
                        strokeWidth={2}
                        name="Baseline"
                      />
                      <Line
                        type="monotone"
                        dataKey="optimistic"
                        stroke="#10B981"
                        strokeWidth={2}
                        name="Optimiste"
                      />
                      <Line
                        type="monotone"
                        dataKey="pessimistic"
                        stroke="#EF4444"
                        strokeWidth={2}
                        name="Pessimiste"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Analyse des risques */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(scenarioResults.risk_analysis).map(([scenario, risks]: [string, any]) => (
                    <div key={scenario} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h4 className="font-medium mb-2 capitalize">{scenario}</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Volatilité</span>
                          <span>{risks.volatility.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">VaR 95%</span>
                          <span>{risks.var_95.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Fonctions helper pour formater les données
  function formatPredictionData() {
    if (!predictions) return [];
    
    const historical = historicalData.slice(-30).map(d => ({
      date: d.date,
      value: d[selectedMetric],
      type: 'historical'
    }));
    
    const predicted = predictions.predictions.dates.map((date: string, idx: number) => ({
      date: date,
      value: predictions.predictions.values[idx],
      lowerBound: predictions.predictions.confidence_intervals[idx][0],
      upperBound: predictions.predictions.confidence_intervals[idx][1],
      type: 'predicted'
    }));
    
    return [...historical, ...predicted];
  }

  function formatScenarioData() {
    if (!scenarioResults) return [];
    
    const data = [];
    const dates = scenarioResults.predictions.baseline.dates;
    
    dates.forEach((date: string, idx: number) => {
      data.push({
        date: date,
        baseline: scenarioResults.predictions.baseline.values[idx],
        optimistic: scenarioResults.predictions.optimistic.values[idx],
        pessimistic: scenarioResults.predictions.pessimistic.values[idx]
      });
    });
    
    return data;
  }
};