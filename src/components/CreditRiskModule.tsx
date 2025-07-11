import React, { useState } from 'react';
import { AlertTriangle, Calculator, FileText, Shield, Upload, TrendingUp, BarChart } from 'lucide-react';
import { LineChart, Line, BarChart as RechartsBarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CreditRiskModule: React.FC = () => {
  const [exposure, setExposure] = useState({
    amount: '',
    type: '',
    rating: '',
    tenor: '',
    lgd: '',
    collateral: '',
    sector: ''
  });

  const [results, setResults] = useState<any>(null);
  const [calculating, setCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState('single');
  const [portfolioData, setPortfolioData] = useState<any>(null);

  const calculateRisk = () => {
    setCalculating(true);
    setTimeout(() => {
      const pd = Math.random() * 0.1;
      const lgd = parseFloat(exposure.lgd) || 0.45;
      const ead = parseFloat(exposure.amount) || 0;
      const ecl = pd * lgd * ead;

      setResults({
        pd: pd.toFixed(4),
        lgd: lgd.toFixed(2),
        ead: ead.toLocaleString(),
        ecl: ecl.toFixed(2),
        rwa: (ead * 1.06).toFixed(2),
        stage: pd > 0.05 ? 'Stage 2' : 'Stage 1',
        recommendations: [
          'Maintenir la surveillance standard',
          'Garanties adéquates',
          'Monitoring trimestriel recommandé',
          'Diversification sectorielle conseillée',
          'Révision annuelle du rating'
        ]
      });
      setCalculating(false);
    }, 1000);
  };

  const calculatePortfolioRisk = () => {
    const mockData = [
      { name: 'AAA', pd: 0.001, lgd: 0.10, ead: 5000000 },
      { name: 'AA', pd: 0.002, lgd: 0.15, ead: 8000000 },
      { name: 'A', pd: 0.005, lgd: 0.25, ead: 12000000 },
      { name: 'BBB', pd: 0.015, lgd: 0.35, ead: 15000000 },
      { name: 'BB', pd: 0.050, lgd: 0.45, ead: 7000000 },
      { name: 'B', pd: 0.100, lgd: 0.55, ead: 3000000 }
    ];

    const totalEAD = mockData.reduce((sum, item) => sum + item.ead, 0);
    const totalECL = mockData.reduce((sum, item) => sum + (item.pd * item.lgd * item.ead), 0);
    const averagePD = mockData.reduce((sum, item) => sum + item.pd * (item.ead / totalEAD), 0);

    setPortfolioData({
      distribution: mockData,
      totalEAD,
      totalECL,
      averagePD,
      heatmapData: generateHeatmapData()
    });
  };

  const generateHeatmapData = () => {
    const sectors = ['Finance', 'Immobilier', 'Industrie', 'Tech', 'Retail'];
    const ratings = ['AAA', 'AA', 'A', 'BBB', 'BB'];
    
    return sectors.map(sector => ({
      sector,
      ...ratings.reduce((acc, rating) => ({
        ...acc,
        [rating]: Math.random() * 10
      }), {})
    }));
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Fichier uploadé:', file.name);
      calculatePortfolioRisk();
    }
  };

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
          background-color: #4B5563;
          border-radius: 2px;
        }
      `}</style>
      
      {/* Card principale */}
      <div className="bg-gray-800 rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Credit Risk Analytics - IFRS 9
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Évaluation avancée du risque de crédit et calcul des provisions
          </p>
        </div>
        
        <div className="p-6">
          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-700 rounded-lg p-1">
            <button
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                activeTab === 'single' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('single')}
            >
              Exposition Unique
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                activeTab === 'portfolio' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('portfolio')}
            >
              Portefeuille
            </button>
          </div>

          {/* Tab content */}
          {activeTab === 'single' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-center">
                {/* Paramètres de l'exposition */}
                <div className="bg-gray-700 rounded-lg w-[380px] min-h-[400px] flex flex-col mx-auto">
                  <div className="p-4 border-b border-gray-600">
                    <h3 className="text-base font-medium">Paramètres de l'exposition</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Montant de l'exposition (€)</label>
                        <input
                          type="number"
                          placeholder="1000000"
                          value={exposure.amount}
                          onChange={(e) => setExposure({...exposure, amount: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Type d'exposition</label>
                        <select
                          value={exposure.type}
                          onChange={(e) => setExposure({...exposure, type: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Sélectionner</option>
                          <option value="corporate">Corporate</option>
                          <option value="retail">Retail</option>
                          <option value="sovereign">Sovereign</option>
                          <option value="financial">Financial Institution</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Rating</label>
                        <select
                          value={exposure.rating}
                          onChange={(e) => setExposure({...exposure, rating: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Sélectionner</option>
                          <option value="aaa">AAA</option>
                          <option value="aa">AA</option>
                          <option value="a">A</option>
                          <option value="bbb">BBB</option>
                          <option value="bb">BB</option>
                          <option value="b">B</option>
                          <option value="ccc">CCC</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Durée (années)</label>
                        <input
                          type="number"
                          placeholder="5"
                          value={exposure.tenor}
                          onChange={(e) => setExposure({...exposure, tenor: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">LGD estimée (%)</label>
                        <input
                          type="number"
                          placeholder="45"
                          value={exposure.lgd}
                          onChange={(e) => setExposure({...exposure, lgd: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Garanties (€)</label>
                        <input
                          type="number"
                          placeholder="500000"
                          value={exposure.collateral}
                          onChange={(e) => setExposure({...exposure, collateral: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border-t border-gray-600">
                    <button
                      onClick={calculateRisk}
                      disabled={calculating}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center"
                    >
                      <Calculator className="mr-2 h-4 w-4" />
                      {calculating ? 'Calcul en cours...' : 'Calculer le risque'}
                    </button>
                  </div>
                </div>

                {/* Résultats de l'évaluation - NOUVEAU DESIGN */}
                {results && (
                  <div className="bg-gray-700 rounded-lg p-6 w-[380px] min-h-[400px] mx-auto animate-fadeIn">
                    <h3 className="text-white text-lg font-medium mb-6">Résultats de l'évaluation</h3>
                    
                    {/* Grille des 4 métriques */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {/* PD */}
                      <div className="bg-gray-700/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-gray-400 text-xs font-medium">PD</span>
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-2xl font-bold text-blue-400">{(parseFloat(results.pd) * 100).toFixed(2)}%</p>
                        <p className="text-xs text-gray-500 mt-1">Probability of Default</p>
                      </div>

                      {/* LGD */}
                      <div className="bg-gray-700/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-gray-400 text-xs font-medium">LGD</span>
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-2xl font-bold text-orange-400">{results.lgd}%</p>
                        <p className="text-xs text-gray-500 mt-1">Loss Given Default</p>
                      </div>

                      {/* EAD */}
                      <div className="bg-gray-700/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-gray-400 text-xs font-medium">EAD</span>
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-2xl font-bold text-purple-400">€{results.ead}</p>
                        <p className="text-xs text-gray-500 mt-1">Exposure at Default</p>
                      </div>

                      {/* ECL */}
                      <div className="bg-gray-700/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-gray-400 text-xs font-medium">ECL</span>
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-2xl font-bold text-red-400">€{parseFloat(results.ecl).toLocaleString()}</p>
                        <p className="text-xs text-gray-500 mt-1">Expected Credit Loss</p>
                      </div>
                    </div>

                    {/* Calcul terminé */}
                    <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-3 mb-4">
                      <div className="flex items-center text-green-400 text-sm">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Calcul terminé avec succès
                      </div>
                    </div>

                    {/* Stage IFRS 9 */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-300 text-sm">Stage IFRS 9</span>
                      <span className={`text-white text-sm px-3 py-1 rounded-full ${
                        results.stage === 'Stage 1' ? 'bg-green-600' : 'bg-yellow-600'
                      }`}>
                        {results.stage}
                      </span>
                    </div>

                    {/* Recommandations */}
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h4 className="text-gray-300 text-sm font-medium mb-2">Recommandations</h4>
                      <div className="max-h-24 overflow-y-auto">
                        <ul className="space-y-1">
                          {results.recommendations.map((rec: string, index: number) => (
                            <li key={index} className="text-gray-400 text-xs flex items-start">
                              <span className="mr-2">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Bouton Recalculer */}
                    <div className="mt-4">
                      <button
                        onClick={calculateRisk}
                        className="w-full border border-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center"
                      >
                        <Calculator className="mr-2 h-4 w-4" />
                        Recalculer
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Analyse graphique */}
              {results && (
                <div className="bg-gray-700 rounded-lg mt-6 p-4">
                  <h3 className="text-base font-medium mb-4">Analyse de sensibilité</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={[
                        { pd: 0.01, ecl: 4500 },
                        { pd: 0.03, ecl: 13500 },
                        { pd: 0.05, ecl: 22500 },
                        { pd: 0.07, ecl: 31500 },
                        { pd: 0.10, ecl: 45000 }
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="pd" label={{ value: 'Probabilité de défaut', position: 'insideBottom', offset: -5 }} />
                      <YAxis label={{ value: 'ECL (€)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="ecl" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-base font-medium mb-2">Analyse du portefeuille</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Importez votre portefeuille pour une analyse complète
                </p>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      id="portfolio-upload"
                      accept=".csv,.xlsx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label htmlFor="portfolio-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center space-y-2">
                        <Upload className="h-8 w-8 text-gray-400" />
                        <p className="text-sm text-gray-400">
                          Glissez-déposez votre fichier ici ou cliquez pour sélectionner
                        </p>
                        <p className="text-xs text-gray-500">
                          Formats supportés: CSV, XLSX
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={calculatePortfolioRisk}
                      className="bg-gray-600 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
                    >
                      <BarChart className="mr-2 h-4 w-4" />
                      Utiliser données de démonstration
                    </button>
                  </div>
                </div>
              </div>

              {portfolioData && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-700 rounded-lg p-6">
                      <div className="text-2xl font-bold">€{(portfolioData.totalEAD / 1000000).toFixed(1)}M</div>
                      <p className="text-xs text-gray-500">Exposition totale</p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-6">
                      <div className="text-2xl font-bold text-red-500">€{(portfolioData.totalECL / 1000).toFixed(0)}K</div>
                      <p className="text-xs text-gray-500">Pertes attendues (ECL)</p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-6">
                      <div className="text-2xl font-bold text-orange-500">{(portfolioData.averagePD * 100).toFixed(2)}%</div>
                      <p className="text-xs text-gray-500">PD moyenne pondérée</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h3 className="text-base font-medium mb-4">Distribution par rating</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={portfolioData.distribution}
                            dataKey="ead"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label={(entry: any) => `${entry.name}: ${(entry.ead / 1000000).toFixed(1)}M`}
                          >
                            {portfolioData.distribution.map((_entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="bg-gray-700 rounded-lg p-4">
                      <h3 className="text-base font-medium mb-4">Matrice de concentration</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsBarChart data={portfolioData.heatmapData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="sector" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          {['AAA', 'AA', 'A', 'BBB', 'BB'].map((rating, index) => (
                            <Bar key={rating} dataKey={rating} stackId="a" fill={COLORS[index]} />
                          ))}
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Export par défaut
export default CreditRiskModule;

// Export nommé pour supporter l'import { CreditRiskModule } from '...'
export { CreditRiskModule };