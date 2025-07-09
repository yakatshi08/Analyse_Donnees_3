// Supprimez tout ce bloc d'état
const [selectedScenario, setSelectedScenario] = useState<'baseline' | 'adverse' | 'severe'>('baseline');
const [showTooltip, setShowTooltip] = useState(false);

// Supprimez la définition des scénarios
const scenarios = [
  {
    id: 'baseline',
    label: 'Baseline',
    description: 'Scénario économique neutre',
    color: 'bg-red-500'
  },
  {
    id: 'adverse',
    label: 'Adverse',
    description: 'Scénario modérément négatif',
    color: 'bg-gray-600'
  },
  {
    id: 'severe',
    label: 'Severe',
    description: 'Scénario de crise grave',
    color: 'bg-gray-700'
  }
];

// Supprimez TOUTE la section JSX du scénario (les deux versions)
<div className="mb-6">
  <div className="flex items-center gap-2 mb-4">
    <label className="block text-sm font-medium text-gray-300">
      Scénario
    </label>
    <div className="relative">
      <InfoIcon 
        className="h-4 w-4 text-gray-400 cursor-help"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      />
      {showTooltip && (
        <div className="absolute z-10 w-64 p-3 -top-2 left-6 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
          <div className="text-xs text-gray-300 space-y-2">
            <div>
              <span className="font-semibold text-red-400">Baseline:</span> Scénario économique neutre
            </div>
            <div>
              <span className="font-semibold text-orange-400">Adverse:</span> Scénario modérément négatif
            </div>
            <div>
              <span className="font-semibold text-red-600">Severe:</span> Scénario de crise grave
            </div>
          </div>
          <div className="absolute -left-1 top-3 w-2 h-2 bg-gray-800 border-l border-t border-gray-700 transform rotate-45"></div>
        </div>
      )}
    </div>
  </div>
  
  <div className="flex justify-center items-center gap-x-4 py-4">
    {scenarios.map((scenario) => (
      <button
        key={scenario.id}
        onClick={() => setSelectedScenario(scenario.id as any)}
        className={`
          px-6 py-3 rounded-lg font-medium transition-all duration-200
          ${selectedScenario === scenario.id 
            ? `${scenario.color} text-white ring-2 ring-offset-2 ring-offset-gray-800 ring-${scenario.color.split('-')[1]}-400 shadow-lg font-bold cursor-default` 
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105 hover:shadow-md'
          }
        `}
      >
        {scenario.label}
      </button>
    ))}
  </div>
</div>

// Supprimez également la version alternative
<div className="mb-6">
  <div className="flex items-center gap-2 mb-4">
    <label className="block text-sm font-medium text-gray-300">
      Scénario
    </label>
    <div className="group relative">
      <InfoIcon className="h-4 w-4 text-gray-400 cursor-help" />
      <div className="invisible group-hover:visible absolute z-10 w-64 p-3 -top-2 left-6 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
        <div className="text-xs text-gray-300 space-y-2">
          <div><span className="font-semibold text-red-400">Baseline:</span> Scénario économique neutre</div>
          <div><span className="font-semibold text-orange-400">Adverse:</span> Scénario modérément négatif</div>
          <div><span className="font-semibold text-red-600">Severe:</span> Scénario de crise grave</div>
        </div>
        <div className="absolute -left-1 top-3 w-2 h-2 bg-gray-800 border-l border-t border-gray-700 transform rotate-45"></div>
      </div>
    </div>
  </div>
  
  <div className="flex justify-center items-center gap-x-6 py-4">
    <button
      onClick={() => setSelectedScenario('baseline')}
      className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
        selectedScenario === 'baseline'
          ? 'bg-red-500 text-white ring-2 ring-offset-2 ring-offset-gray-800 ring-red-400 shadow-lg font-bold cursor-default'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105 hover:shadow-md'
      }`}
    >
      Baseline
    </button>
    
    <button
      onClick={() => setSelectedScenario('adverse')}
      className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
        selectedScenario === 'adverse'
          ? 'bg-orange-600 text-white ring-2 ring-offset-2 ring-offset-gray-800 ring-orange-400 shadow-lg font-bold cursor-default'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105 hover:shadow-md'
      }`}
    >
      Adverse
    </button>
    
    <button
      onClick={() => setSelectedScenario('severe')}
      className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
        selectedScenario === 'severe'
          ? 'bg-red-700 text-white ring-2 ring-offset-2 ring-offset-gray-800 ring-red-500 shadow-lg font-bold cursor-default'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105 hover:shadow-md'
      }`}
    >
      Severe
    </button>
  </div>
</div>