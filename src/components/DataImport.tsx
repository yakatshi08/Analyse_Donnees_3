import React, { useState, useCallback } from 'react';
import { 
  Upload, FileSpreadsheet, FileText, FileJson, 
  Database, Cloud, Check, AlertCircle, Loader,
  Sparkles, FileCheck, TrendingUp, CreditCard
} from 'lucide-react';
import { useStore } from '../store';
import { useTranslation } from '../hooks/useTranslation';
// Fonction cn simple sans dépendances
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};
import { ImportAssistant } from '../services/ImportAssistant';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export const DataImport: React.FC = () => {
  const store = useStore();
  const { darkMode, setSelectedSector, setActiveModule } = store;
  const setUserProfile = (store as any).setUserProfile;
  const { t } = useTranslation();
  
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [detectedSector, setDetectedSector] = useState<'banking' | 'insurance' | null>(null);
  const [recommendedKPIs, setRecommendedKPIs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [importedRowCount, setImportedRowCount] = useState(0);
  const [creditDetected, setCreditDetected] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const parseFile = async (file: File): Promise<any[]> => {
    const fileType = file.name.split('.').pop()?.toLowerCase();
    
    return new Promise((resolve, reject) => {
      if (fileType === 'csv') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          const result = Papa.parse(text, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            delimitersToGuess: [',', '\t', '|', ';']
          });
          
          if (result.errors.length > 0) {
            console.error('Erreurs de parsing CSV:', result.errors);
          }
          resolve(result.data);
        };
        reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
        reader.readAsText(file);
        
      } else if (fileType === 'xlsx' || fileType === 'xls') {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);
            resolve(jsonData);
          } catch (error) {
            reject(new Error('Erreur de parsing Excel'));
          }
        };
        reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
        reader.readAsArrayBuffer(file);
        
      } else if (fileType === 'json') {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const jsonData = JSON.parse(e.target?.result as string);
            resolve(Array.isArray(jsonData) ? jsonData : [jsonData]);
          } catch (error) {
            reject(new Error('Format JSON invalide'));
          }
        };
        reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
        reader.readAsText(file);
        
      } else {
        reject(new Error('Format de fichier non supporté'));
      }
    });
  };

  const analyzeFile = async (file: File) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Parser le fichier
      const data = await parseFile(file);
      setImportedRowCount(data.length);
      
      // Analyser les données
      const headers = data.length > 0 ? Object.keys(data[0]) : [];
      
      // Détection du secteur basée sur les colonnes
      let detectedSector: 'banking' | 'insurance' | null = null;
      const bankingKeywords = ['loan', 'credit', 'interest', 'rate', 'amount', 'balance'];
      const insuranceKeywords = ['premium', 'claim', 'policy', 'coverage', 'deductible'];
      
      const headerLower = headers.map(h => h.toLowerCase()).join(' ');
      if (bankingKeywords.some(keyword => headerLower.includes(keyword))) {
        detectedSector = 'banking';
      } else if (insuranceKeywords.some(keyword => headerLower.includes(keyword))) {
        detectedSector = 'insurance';
      }
      
      // Créer le résultat d'analyse
      const result = {
        detectedSector,
        detectedColumns: headers,
        recommendedKPIs: detectedSector === 'banking' 
          ? ['Taux moyen', 'Montant total', 'Durée moyenne', 'Ratio défaut']
          : ['Prime totale', 'Ratio sinistralité', 'Fréquence claims']
      };
      
      console.log('Résultat analyse:', result);
      
      // Détecter le secteur et les KPIs
      setDetectedSector(result.detectedSector);
      setRecommendedKPIs(result.recommendedKPIs);
      
      // Vérifier si c'est un portefeuille de crédit
      const creditColumns = ['loan_id', 'customer_id', 'amount', 'rate', 'maturity'];
      const foundColumns = creditColumns.filter(col => 
        result.detectedColumns.some(c => c.toLowerCase().includes(col))
      );
      
      if (foundColumns.length >= 3) {
        setCreditDetected(true);
        console.log('🎯 Portefeuille de crédit détecté!');
      }
      
      // Sauvegarder les données
      const importData = {
        fileName: file.name,
        rowCount: data.length,
        data: data,
        headers: result.detectedColumns,
        sector: result.detectedSector,
        timestamp: new Date().toISOString()
      };
      
      // Sauvegarder dans localStorage
      localStorage.setItem('importedData', JSON.stringify(importData));
      
      // Si crédit détecté, sauvegarder aussi pour le Credit Risk Widget
      if (creditDetected || foundColumns.length >= 3) {
        localStorage.setItem('creditRiskData', JSON.stringify(importData));
        
        // Mettre à jour le profil utilisateur si fonction disponible
        if (typeof setUserProfile === 'function') {
          setUserProfile({ id: 'banker', name: 'Banquier' });
        }
      }
      
      // Mettre à jour le secteur sélectionné
      if (result.detectedSector) {
        setSelectedSector(result.detectedSector);
      }
      
      setAnalysisComplete(true);
      
    } catch (error) {
      console.error('Erreur analyse:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de l\'analyse');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setAnalysisComplete(false);
      await analyzeFile(droppedFile);
    }
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAnalysisComplete(false);
      await analyzeFile(selectedFile);
    }
  }, []);

  const navigateToDashboard = () => {
    console.log('🚀 Navigation vers Dashboard depuis DataImport');
    setActiveModule('dashboard');
  };

  const resetImport = () => {
    setFile(null);
    setUploadProgress(0);
    setAnalysisComplete(false);
    setDetectedSector(null);
    setRecommendedKPIs([]);
    setError(null);
    setImportedRowCount(0);
    setCreditDetected(false);
  };

  return (
    <div className={cn(
      "flex flex-col h-full",
      darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
    )}>
      <div className="max-w-4xl mx-auto w-full p-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mb-6">
            <Upload className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold mb-4">
            Import de Données Intelligent
          </h1>
          <p className={cn(
            "text-xl",
            darkMode ? "text-gray-400" : "text-gray-600"
          )}>
            Importez vos données et laissez notre IA configurer automatiquement votre environnement
          </p>
        </div>

        {!file ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "relative rounded-2xl border-2 border-dashed p-12 transition-all duration-300",
              isDragging 
                ? "border-indigo-500 bg-indigo-50/10 scale-105" 
                : darkMode 
                  ? "border-gray-700 hover:border-gray-600" 
                  : "border-gray-300 hover:border-gray-400",
              "hover:shadow-xl"
            )}
          >
            <input
              type="file"
              onChange={handleFileSelect}
              accept=".csv,.xlsx,.xls,.json"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="file-upload"
            />
            
            <div className="text-center">
              <div className="flex justify-center space-x-8 mb-8">
                <div className="flex flex-col items-center">
                  <FileSpreadsheet className={cn(
                    "h-12 w-12 mb-2",
                    darkMode ? "text-green-400" : "text-green-600"
                  )} />
                  <span className={darkMode ? "text-gray-400" : "text-gray-600"}>Excel</span>
                </div>
                <div className="flex flex-col items-center">
                  <FileText className={cn(
                    "h-12 w-12 mb-2",
                    darkMode ? "text-blue-400" : "text-blue-600"
                  )} />
                  <span className={darkMode ? "text-gray-400" : "text-gray-600"}>CSV</span>
                </div>
                <div className="flex flex-col items-center">
                  <FileJson className={cn(
                    "h-12 w-12 mb-2",
                    darkMode ? "text-purple-400" : "text-purple-600"
                  )} />
                  <span className={darkMode ? "text-gray-400" : "text-gray-600"}>JSON</span>
                </div>
              </div>
              
              <p className={cn(
                "text-lg mb-2",
                darkMode ? "text-gray-300" : "text-gray-700"
              )}>
                Glissez-déposez votre fichier ici
              </p>
              <p className={darkMode ? "text-gray-500" : "text-gray-500"}>
                ou cliquez pour sélectionner
              </p>
            </div>

            {isDragging && (
              <div className="absolute inset-0 flex items-center justify-center bg-indigo-500/20 rounded-2xl">
                <p className="text-2xl font-semibold text-indigo-600">
                  Déposez le fichier ici
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className={cn(
            "rounded-2xl p-8",
            darkMode ? "bg-gray-800" : "bg-white shadow-lg"
          )}>
            {/* En-tête du fichier */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <FileCheck className="h-8 w-8 text-green-500" />
                <div>
                  <h3 className="text-lg font-semibold">{file.name}</h3>
                  <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                    {importedRowCount > 0 && `${importedRowCount} lignes • `}
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              {analysisComplete && (
                <Check className="h-8 w-8 text-green-500" />
              )}
            </div>

            {/* Barre de progression ou analyse */}
            {isAnalyzing ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Loader className="h-5 w-5 animate-spin text-indigo-500" />
                  <span>Analyse en cours...</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: '75%' }}
                  />
                </div>
              </div>
            ) : analysisComplete ? (
              <div className="space-y-6">
                {/* Résultats de l'analyse */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className={cn(
                      "text-sm font-medium mb-2",
                      darkMode ? "text-gray-400" : "text-gray-600"
                    )}>
                      Secteur détecté
                    </h4>
                    <div className="flex items-center space-x-2">
                      {detectedSector === 'banking' ? (
                        <>
                          <TrendingUp className="h-5 w-5 text-blue-500" />
                          <span className="font-semibold">Bancaire</span>
                        </>
                      ) : detectedSector === 'insurance' ? (
                        <>
                          <Shield className="h-5 w-5 text-green-500" />
                          <span className="font-semibold">Assurance</span>
                        </>
                      ) : (
                        <span className="text-gray-500">Non déterminé</span>
                      )}
                    </div>
                  </div>
                  
                  {creditDetected && (
                    <div>
                      <h4 className={cn(
                        "text-sm font-medium mb-2",
                        darkMode ? "text-gray-400" : "text-gray-600"
                      )}>
                        Type de données
                      </h4>
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-5 w-5 text-purple-500" />
                        <span className="font-semibold text-purple-600">
                          Portefeuille de crédit détecté
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* KPIs recommandés */}
                {recommendedKPIs.length > 0 && (
                  <div>
                    <h4 className={cn(
                      "text-sm font-medium mb-3",
                      darkMode ? "text-gray-400" : "text-gray-600"
                    )}>
                      KPIs recommandés
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {recommendedKPIs.map((kpi, index) => (
                        <span
                          key={index}
                          className={cn(
                            "px-3 py-1 rounded-full text-sm",
                            darkMode 
                              ? "bg-gray-700 text-gray-300" 
                              : "bg-gray-100 text-gray-700"
                          )}
                        >
                          {kpi}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Message de succès */}
                <div className={cn(
                  "flex items-center space-x-3 p-4 rounded-lg",
                  darkMode ? "bg-green-900/30" : "bg-green-50"
                )}>
                  <Check className="h-5 w-5 text-green-500" />
                  <span className={darkMode ? "text-green-400" : "text-green-700"}>
                    Import terminé avec succès ! 
                    {creditDetected && " Analyse de crédit disponible."}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex space-x-4 mt-6">
                  <button 
                    onClick={navigateToDashboard}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg
                      hover:bg-indigo-700 transition-colors"
                  >
                    Voir le Dashboard
                  </button>
                  <button 
                    onClick={resetImport}
                    className={cn(
                      "flex-1 px-4 py-2 rounded-lg transition-colors",
                      darkMode 
                        ? "bg-gray-700 hover:bg-gray-600 text-white" 
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    )}
                  >
                    Nouveau fichier
                  </button>
                </div>
              </div>
            ) : null}

            {/* Erreur */}
            {error && (
              <div className={cn(
                "flex items-center space-x-3 p-4 rounded-lg mt-4",
                darkMode ? "bg-red-900/30" : "bg-red-50"
              )}>
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className={darkMode ? "text-red-400" : "text-red-700"}>
                  {error}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Formats supportés */}
        <div className="mt-12 text-center">
          <p className={cn(
            "text-sm",
            darkMode ? "text-gray-500" : "text-gray-600"
          )}>
            Formats supportés : CSV, Excel (XLSX/XLS), JSON
          </p>
          <p className={cn(
            "text-sm mt-2",
            darkMode ? "text-gray-600" : "text-gray-500"
          )}>
            Taille maximale : 50 MB
          </p>
        </div>
      </div>
    </div>
  );
};