import React, { useState } from 'react';
import { Database, Upload, Download, Search, Filter, FileSpreadsheet, FileText, FileJson, Shield, CheckCircle, AlertCircle, Eye, Lock, TrendingUp, History, Trash2 } from 'lucide-react';

interface DatasetsProps {
  isDarkMode: boolean;
}

const Datasets: React.FC<DatasetsProps> = ({ isDarkMode }) => {
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Datasets EXISTANTS - ON GARDE TOUT
  const datasets = [
    {
      name: "Données Clients 2024",
      size: "2.3 MB",
      records: "15,420",
      lastUpdated: "Il y a 2 heures",
      status: "Actif"
    },
    {
      name: "Transactions E-commerce",
      size: "8.7 MB", 
      records: "45,230",
      lastUpdated: "Il y a 1 jour",
      status: "Actif"
    },
    {
      name: "Données Marketing",
      size: "1.2 MB",
      records: "8,950",
      lastUpdated: "Il y a 3 jours",
      status: "Archivé"
    },
    {
      name: "Analytics Web",
      size: "5.4 MB",
      records: "32,100",
      lastUpdated: "Il y a 5 heures",
      status: "Actif"
    }
  ];

  // NOUVEAUX Datasets FINANCIERS - AJOUT
  const financialDatasets = [
    {
      name: "Portefeuille Crédit Q1 2024",
      type: "credit",
      size: "12.5 MB",
      records: "85,420",
      lastUpdated: "Il y a 1 heure",
      status: "Actif",
      quality: 98,
      gdprCompliant: true,
      metrics: ["PD", "LGD", "EAD", "NPL"],
      validation: "Validé IFRS 9"
    },
    {
      name: "Données Risque Marché",
      type: "market",
      size: "34.2 MB",
      records: "125,800",
      lastUpdated: "Il y a 30 min",
      status: "Actif",
      quality: 95,
      gdprCompliant: true,
      metrics: ["VaR", "CVaR", "Greeks"],
      validation: "Conforme Bâle III"
    },
    {
      name: "Ratios Prudentiels 2024",
      type: "regulatory",
      size: "5.8 MB",
      records: "12,340",
      lastUpdated: "Il y a 3 heures",
      status: "Actif",
      quality: 100,
      gdprCompliant: true,
      metrics: ["CET1", "LCR", "NSFR"],
      validation: "COREP/FINREP"
    },
    {
      name: "Données ALM Liquidité",
      type: "liquidity",
      size: "8.3 MB",
      records: "45,670",
      lastUpdated: "Il y a 1 jour",
      status: "Actif",
      quality: 92,
      gdprCompliant: true,
      metrics: ["Gap Analysis", "Duration"],
      validation: "Stress Test BCE"
    }
  ];

  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'csv':
        return <FileText className="w-8 h-8 text-green-500" />;
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="w-8 h-8 text-blue-500" />;
      case 'json':
        return <FileJson className="w-8 h-8 text-purple-500" />;
      default:
        return <FileText className="w-8 h-8 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'credit':
        return 'bg-red-100 text-red-800';
      case 'market':
        return 'bg-blue-100 text-blue-800';
      case 'regulatory':
        return 'bg-purple-100 text-purple-800';
      case 'liquidity':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header EXISTANT - ENRICHI */}
      <div className="flex justify-between items-center">
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Gestion des Datasets
        </h2>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Upload size={16} />
            Importer
          </button>
          <button className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isDarkMode 
              ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}>
            <Download size={16} />
            Exporter
          </button>
        </div>
      </div>

      {/* Search and Filter EXISTANT */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Rechercher un dataset..."
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-600 text-white' 
                : 'bg-white border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
        <button className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          isDarkMode 
            ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}>
          <Filter size={16} />
          Filtrer
        </button>
      </div>

      {/* Datasets Grid EXISTANT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {datasets.map((dataset, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer ${
              isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-8 h-8 text-blue-500" />
              <div>
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {dataset.name}
                </h3>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  dataset.status === 'Actif' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {dataset.status}
                </span>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className={`flex justify-between ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <span>Taille:</span>
                <span className="font-medium">{dataset.size}</span>
              </div>
              <div className={`flex justify-between ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <span>Enregistrements:</span>
                <span className="font-medium">{dataset.records}</span>
              </div>
              <div className={`flex justify-between ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <span>Dernière MAJ:</span>
                <span className="font-medium">{dataset.lastUpdated}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION SÉPARATEUR - NOUVEAU */}
      <div className={`flex items-center justify-center my-8 ${
        isDarkMode ? 'text-gray-600' : 'text-gray-400'
      }`}>
        <div className="flex-1 border-t" style={{ borderColor: isDarkMode ? '#374151' : '#e5e7eb' }}></div>
        <div className="mx-4 text-sm font-semibold flex items-center gap-2">
          <TrendingUp size={16} />
          DATASETS FINANCIERS RÉGLEMENTAIRES
        </div>
        <div className="flex-1 border-t" style={{ borderColor: isDarkMode ? '#374151' : '#e5e7eb' }}></div>
      </div>

      {/* NOUVEAUX Datasets Financiers Grid - AJOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {financialDatasets.map((dataset, index) => (
          <div
            key={`financial-${index}`}
            className={`p-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border ${
              isDarkMode 
                ? 'bg-gray-800 hover:bg-gray-750 border-gray-700' 
                : 'bg-white hover:bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-8 h-8 text-blue-500" />
                <div>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {dataset.name}
                  </h3>
                  <div className="flex gap-2 mt-1">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${getTypeColor(dataset.type)}`}>
                      {dataset.type.toUpperCase()}
                    </span>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      dataset.status === 'Actif' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {dataset.status}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Indicateurs de qualité et conformité */}
              <div className="flex items-center gap-2">
                {dataset.gdprCompliant && (
                  <div className="group relative">
                    <Shield className="w-5 h-5 text-green-500" />
                    <div className={`absolute right-0 top-full mt-1 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap ${
                      isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-800 text-white'
                    }`}>
                      GDPR Compliant
                    </div>
                  </div>
                )}
                <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                  dataset.quality >= 95 
                    ? 'bg-green-100 text-green-800' 
                    : dataset.quality >= 90 
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-orange-100 text-orange-800'
                }`}>
                  <CheckCircle size={12} />
                  {dataset.quality}%
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {/* Métriques disponibles */}
              <div>
                <p className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Métriques disponibles:
                </p>
                <div className="flex flex-wrap gap-1">
                  {dataset.metrics.map((metric, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-1 text-xs rounded ${
                        isDarkMode 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {metric}
                    </span>
                  ))}
                </div>
              </div>

              {/* Validation */}
              <div className={`flex items-center gap-2 text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <CheckCircle size={14} className="text-green-500" />
                <span>{dataset.validation}</span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span className="block text-xs">Taille</span>
                  <span className="font-medium">{dataset.size}</span>
                </div>
                <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span className="block text-xs">Lignes</span>
                  <span className="font-medium">{dataset.records}</span>
                </div>
                <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span className="block text-xs">MAJ</span>
                  <span className="font-medium text-xs">{dataset.lastUpdated}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t" style={{ borderColor: isDarkMode ? '#374151' : '#e5e7eb' }}>
                <button className={`flex items-center gap-1 px-3 py-1 text-xs rounded transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                  <Eye size={12} />
                  Aperçu
                </button>
                <button className={`flex items-center gap-1 px-3 py-1 text-xs rounded transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                  <History size={12} />
                  Historique
                </button>
                <button className={`flex items-center gap-1 px-3 py-1 text-xs rounded transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                  <Lock size={12} />
                  Anonymiser
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL D'IMPORT - NOUVEAU */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`w-full max-w-2xl p-6 rounded-xl shadow-xl ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Importer des Données Financières
            </h3>

            {/* Zone de drag & drop */}
            <div className={`border-2 border-dashed rounded-lg p-8 text-center ${
              isDarkMode 
                ? 'border-gray-600 bg-gray-700/50' 
                : 'border-gray-300 bg-gray-50'
            }`}>
              <input
                type="file"
                id="fileInput"
                className="hidden"
                accept=".csv,.xlsx,.xls,.json"
                onChange={handleFileSelect}
              />
              <label htmlFor="fileInput" className="cursor-pointer">
                <Upload className={`w-12 h-12 mx-auto mb-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <p className={`text-lg mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Glissez vos fichiers ici ou cliquez pour parcourir
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Formats supportés: CSV, Excel (.xlsx, .xls), JSON
                </p>
              </label>
            </div>

            {/* Fichier sélectionné */}
            {selectedFile && (
              <div className={`mt-4 p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getFileIcon(selectedFile.name)}
                    <div>
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedFile.name}
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className={`p-2 rounded hover:bg-opacity-20 ${
                      isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-300'
                    }`}
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>

                {/* Options de validation */}
                <div className="mt-4 space-y-3">
                  <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Options de Validation
                  </h4>
                  
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Validation automatique IFRS 9
                    </span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Détection et anonymisation PII (GDPR)
                    </span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Mapping intelligent colonnes financières
                    </span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Calcul automatique ratios manquants
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setSelectedFile(null);
                }}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Annuler
              </button>
              <button
                disabled={!selectedFile}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedFile
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Valider et Importer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Datasets;