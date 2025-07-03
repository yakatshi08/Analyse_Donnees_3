{/* Graphique 1 : Analyse Trimestrielle 2024 - VERSION AMÉLIORÉE */}
<div className={`p-6 rounded-xl shadow-lg ${
  isDarkMode ? 'bg-gray-800' : 'bg-white'
}`}>
  <h3 className={`text-lg font-semibold mb-4 ${
    isDarkMode ? 'text-white' : 'text-gray-900'
  }`}>
    Analyse Trimestrielle 2024
  </h3>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart 
      data={quarterlyData}
      margin={{ top: 30, right: 30, left: 20, bottom: 20 }}
      barGap={10}
    >
      <CartesianGrid 
        strokeDasharray="3 3" 
        stroke={isDarkMode ? '#374151' : '#e5e7eb'}
        horizontal={true}
        vertical={false}
      />
      <XAxis 
        dataKey="quarter" 
        stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
        fontSize={14}
        tick={{ fontSize: 14 }}
      />
      <YAxis 
        stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
        fontSize={12}
      />
      <Tooltip 
        contentStyle={{
          backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
          border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
          borderRadius: '8px',
          color: isDarkMode ? '#ffffff' : '#000000'
        }}
      />
      <Legend />
      <Bar 
        dataKey="Revenus" 
        fill="#3b82f6" 
        name="Revenus (€)"
        label={{
          position: 'top',
          fill: isDarkMode ? '#ffffff' : '#000000',
          fontSize: 11,
          formatter: (value: number) => `€${value.toLocaleString()}`
        }}
      />
      <Bar 
        dataKey="Coûts" 
        fill="#ef4444" 
        name="Coûts (€)"
        label={{
          position: 'top',
          fill: isDarkMode ? '#ffffff' : '#000000',
          fontSize: 11,
          formatter: (value: number) => `€${value.toLocaleString()}`
        }}
      />
      <Bar 
        dataKey="Profit" 
        fill="#10b981" 
        name="Profit (€)"
        label={{
          position: 'top',
          fill: isDarkMode ? '#ffffff' : '#000000',
          fontSize: 11,
          formatter: (value: number) => `€${value.toLocaleString()}`
        }}
      />
    </BarChart>
  </ResponsiveContainer>
</div>

{/* Graphique 2 : Performance Globale - RADAR AMÉLIORÉ */}
<div className={`p-6 rounded-xl shadow-lg ${
  isDarkMode ? 'bg-gray-800' : 'bg-white'
}`}>
  <h3 className={`text-lg font-semibold mb-4 ${
    isDarkMode ? 'text-white' : 'text-gray-900'
  }`}>
    Performance Globale
  </h3>
  <ResponsiveContainer width="100%" height={300}>
    <RadarChart 
      data={radarData}
      margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
    >
      <PolarGrid 
        stroke={isDarkMode ? '#4b5563' : '#d1d5db'}
        strokeWidth={1.5}
      />
      <PolarAngleAxis 
        dataKey="subject" 
        tick={{ 
          fill: isDarkMode ? '#9ca3af' : '#6b7280',
          fontSize: 12
        }}
      />
      <PolarRadiusAxis 
        angle={90} 
        domain={[0, 100]}
        tick={{ 
          fill: isDarkMode ? '#9ca3af' : '#6b7280',
          fontSize: 10
        }}
        tickCount={5}
      />
      <Radar
        name="Performance"
        dataKey="A"
        stroke="#10b981"
        fill="#10b981"
        fillOpacity={0.3}
        strokeWidth={2}
        label={{
          position: 'outside',
          fill: isDarkMode ? '#ffffff' : '#000000',
          fontSize: 12,
          formatter: (value: number) => value
        }}
      />
      <Tooltip 
        contentStyle={{
          backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
          border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
          borderRadius: '8px',
          color: isDarkMode ? '#ffffff' : '#000000'
        }}
      />
    </RadarChart>
  </ResponsiveContainer>
</div>
