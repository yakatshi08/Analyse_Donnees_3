import React, { useState, useCallback } from 'react';
import { 
  Upload, FileSpreadsheet, FileText, FileJson, 
  Database, Cloud, Check, AlertCircle, Loader,
  Sparkles, FileCheck, TrendingUp
} from 'lucide-react';
import { useStore } from '../store';
import { useTranslation } from '../hooks/useTranslation';

interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

interface ImportStatus {
  stage: 'idle' | 'uploading' | 'analyzing' | 'configuring' | 'complete';
  progress: number;
  message: string;
  detectedSector?: 'banking' | 'insurance' | 'mixed';
  suggestedKPIs?: string[];
  dataSchema?: any;
}

export const DataImport: React.FC = () => {
  const { darkMode, setSelectedSector } = useStore();
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);
  const [importStatus, setImportStatus] = useState<ImportStatus>({
    stage: 'idle',
    progress: 0,
    message: ''
  });

  // Patterns pour détecter le secteur
  const sectorPatterns = {
    banking: ['assets', 'loans', 'nii', 'tier1', 'lcr', 'provisions', 'basel', 'cet1', 'nsfr'],
    insurance: ['premiums', 'claims', 'reserves', 'scr', 'combined_ratio', 'solvency', 'mcr', 'underwriting']
  };

  // Gestion du drag & drop
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleFileSelect = async (file: File) => {
    const fileInfo: FileInfo = {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    };
    
    setSelectedFile(fileInfo);
    await processFile(file);
  };

  const processFile = async (file: File) => {
    // Étape 1: Upload
    setImportStatus({
      stage: 'uploading',
      progress: 25,
      message: 'Chargement du fichier...'
    });

    // Simuler le traitement (en production, appel API réel)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Étape 2: Analyse
    setImportStatus({
      stage: 'analyzing',
      progress: 50,
      message: 'Analyse du contenu avec IA...'
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Détection du secteur (simulation)
    const detectedSector = Math.random() > 0.5 ? 'banking' : 'insurance';
    const suggestedKPIs = detectedSector === 'banking' 
      ? ['CET1 Ratio', 'LCR', 'NPL Ratio', 'ROE']
      : ['SCR Ratio', 'Combined Ratio', 'Loss Ratio', 'MCR'];

    // Étape 3: Configuration
    setImportStatus({
      stage: 'configuring',
      progress: 75,
      message: 'Configuration automatique du dashboard...',
      detectedSector,
      suggestedKPIs
    });

    await new Promise(resolve => setTimeout(resolve, 1500));

    // Étape 4: Complet
    setImportStatus({
      stage: 'complete',
      progress: 100,
      message: 'Import terminé avec succès !',
      detectedSector,
      suggestedKPIs
    });

    // Mettre à jour le secteur dans le store
    setSelectedSector(detectedSector === 'mixed' ? 'all' : detectedSector);
  };

  const getFileIcon = (type: string) => {
    if (type.includes('sheet') || type.includes('excel') || type.includes('csv')) {
      return <FileSpreadsheet className="h-12 w-12 text-green-500" />;
    } else if (type.includes('pdf')) {
      return <FileText className="h-12 w-12 text-red-500" />;
    } else if (type.includes('json') || type.includes('xml')) {
      return <FileJson className="h-12 w-12 text-blue-500" />;
    }
    return <Database className="h-12 w-12 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Import de Données Intelligent
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Notre IA analyse vos données et configure automatiquement votre dashboard
          </p>
        </div>

        {/* Zone de Drop */}
        {importStatus.stage === 'idle' && (
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all
              ${isDragging 
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                : darkMode 
                  ? 'border-gray-700 bg-gray-800' 
                  : 'border-gray-300 bg-white'}`}
          >
            <Upload className={`h-16 w-16 mx-auto mb-4 
              ${isDragging ? 'text-indigo-500' : darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            
            <h3 className={`text-xl font-semibold mb-2 
              ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Glissez vos fichiers ici
            </h3>
            
            <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              ou cliquez pour parcourir
            </p>

            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".xlsx,.xls,.csv,.pdf,.json,.xml"
              onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
            />
            
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white 
                rounded-lg hover:bg-indigo-700 cursor-pointer transition-colors"
            >
              <FileCheck className="h-5 w-5 mr-2" />
              Choisir un fichier
            </label>

            {/* Formats supportés */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: FileSpreadsheet, label: 'Excel/CSV', color: 'text-green-500' },
                { icon: FileText, label: 'PDF', color: 'text-red-500' },
                { icon: FileJson, label: 'JSON/XML', color: 'text-blue-500' },
                { icon: Cloud, label: 'API', color: 'text-purple-500' }
              ].map((format, idx) => (
                <div key={idx} className={`flex flex-col items-center p-3 rounded-lg
                  ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <format.icon className={`h-8 w-8 mb-2 ${format.color}`} />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {format.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* État d'import */}
        {importStatus.stage !== 'idle' && (
          <div className={`rounded-xl p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            {/* Fichier sélectionné */}
            {selectedFile && (
              <div className="flex items-center space-x-4 mb-6">
                {getFileIcon(selectedFile.type)}
                <div className="flex-1">
                  <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedFile.name}
                  </h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                {importStatus.stage === 'complete' && (
                  <Check className="h-8 w-8 text-green-500" />
                )}
              </div>
            )}

            {/* Barre de progression */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {importStatus.message}
                </span>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {importStatus.progress}%
                </span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden
                ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div 
                  className="h-full bg-indigo-600 transition-all duration-500"
                  style={{ width: `${importStatus.progress}%` }}
                />
              </div>
            </div>

            {/* Résultats de l'analyse */}
            {importStatus.stage === 'complete' && (
              <div className="space-y-4">
                {/* Secteur détecté */}
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="h-5 w-5 text-indigo-500" />
                    <h5 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Secteur détecté
                    </h5>
                  </div>
                  <p className={`text-lg font-medium capitalize
                    ${importStatus.detectedSector === 'banking' ? 'text-blue-500' : 'text-purple-500'}`}>
                    {importStatus.detectedSector === 'banking' ? '🏦 Bancaire' : '🛡️ Assurance'}
                  </p>
                </div>

                {/* KPIs suggérés */}
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <h5 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      KPIs recommandés
                    </h5>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {importStatus.suggestedKPIs?.map((kpi, idx) => (
                      <span key={idx} className={`px-3 py-1 rounded-full text-sm
                        ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                        {kpi}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-4 mt-6">
                  <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg
                    hover:bg-indigo-700 transition-colors">
                    Voir le Dashboard
                  </button>
                  <button 
                    onClick={() => {
                      setImportStatus({ stage: 'idle', progress: 0, message: '' });
                      setSelectedFile(null);
                    }}
                    className={`px-4 py-2 rounded-lg transition-colors
                      ${darkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                    Nouveau fichier
                  </button>
                </div>
              </div>
            )}

            {/* Loader animation */}
            {importStatus.stage !== 'complete' && importStatus.stage !== 'idle' && (
              <div className="flex justify-center mt-4">
                <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
              </div>
            )}
          </div>
        )}

        {/* Connexions API */}
        <div className="mt-12">
          <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Connexions directes disponibles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Temenos T24', type: 'Banking Core', status: 'active' },
              { name: 'SAP S/4HANA', type: 'ERP', status: 'active' },
              { name: 'Guidewire', type: 'Insurance Platform', status: 'inactive' },
              { name: 'Bloomberg API', type: 'Market Data', status: 'active' },
              { name: 'Reuters Eikon', type: 'Financial Data', status: 'inactive' },
              { name: 'ECB Data Portal', type: 'Regulatory', status: 'active' }
            ].map((api, idx) => (
              <div key={idx} className={`p-4 rounded-lg border transition-all cursor-pointer
                ${darkMode 
                  ? 'bg-gray-800 border-gray-700 hover:border-indigo-500' 
                  : 'bg-white border-gray-200 hover:border-indigo-500'}`}>
                <div className="flex items-center justify-between mb-2">
                  <Cloud className={`h-5 w-5 ${api.status === 'active' ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className={`text-xs px-2 py-1 rounded-full
                    ${api.status === 'active' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400' 
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'}`}>
                    {api.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {api.name}
                </h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {api.type}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};