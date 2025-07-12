// Modifications à apporter au fichier CreditRisk.tsx actuel

// 1. Remplacer la structure du return par :

return (
  <div className="min-h-screen"> {/* Retirer les classes space-y-6 */}
    {/* Header fixe */}
    <div className="sticky top-0 z-40 bg-slate-900 dark:bg-gray-900 px-6 pt-6 pb-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Module Credit Risk - IFRS 9
          </h2>
          <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Analyse PD, LGD, EAD et calcul des provisions ECL
          </p>
        </div>
        
        {/* Sélecteurs de période et portfolio */}
        <div className="flex gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDarkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <option value="1M">1 Mois</option>
            <option value="3M">3 Mois</option>
            <option value="6M">6 Mois</option>
            <option value="12M">12 Mois</option>
          </select>
          
          <select
            value={selectedPortfolio}
            onChange={(e) => setSelectedPortfolio(e.target.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDarkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <option value="retail">Retail</option>
            <option value="corporate">Corporate</option>
            <option value="mortgage">Mortgage</option>
            <option value="all">Tous</option>
          </select>
        </div>
      </div>
    </div>

    {/* Contenu scrollable */}
    <div className="p-6 pt-2 space-y-6">
      {/* KPIs Credit Risk */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {riskKPIs.map((kpi, index) => (
          <div key={index} className={`p-4 rounded-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <h4 className={`text-sm font-medium ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {kpi.label}
            </h4>
            <p className={`text-2xl font-bold mt-2 ${
              kpi.status === 'good' ? 'text-green-500' : 'text-yellow-500'
            }`}>
              {kpi.value}
            </p>
            <p className={`text-xs mt-1 ${
              kpi.trend > 0 ? 'text-red-500' : kpi.trend < 0 ? 'text-green-500' : 'text-gray-500'
            }`}>
              {kpi.trend > 0 ? '↑' : kpi.trend < 0 ? '↓' : '→'} {Math.abs(kpi.trend)}%
            </p>
          </div>
        ))}
      </div>

      {/* ... reste du contenu inchangé ... */}
    </div>
  </div>
);