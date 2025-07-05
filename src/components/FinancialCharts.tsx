import React from 'react';
import Plot from 'react-plotly.js';
import { useFinanceStore } from '../store';

const FinancialCharts: React.FC = () => {
  const { isDarkMode, quarterlyData, kpis, waterfallData, correlationData } = useFinanceStore();

  // Transformation des données de marché pour le candlestick
  const candlestickData = {
    x: quarterlyData.map(d => d.date),
    close: quarterlyData.map(d => d.close),
    high: quarterlyData.map(d => d.high),
    low: quarterlyData.map(d => d.low),
    open: quarterlyData.map(d => d.open)
  };

  // Labels pour la heatmap
  const heatmapLabels = correlationData?.assets || ['CAC 40', 'S&P 500', 'EUR/USD', 'Gold', 'Oil'];

  // Matrice de corrélation
  const correlationMatrix = correlationData?.matrix || [
    [1.00, 0.85, -0.60, 0.45, 0.72],
    [0.85, 1.00, -0.45, 0.38, 0.68],
    [-0.60, -0.45, 1.00, -0.35, -0.52],
    [0.45, 0.38, -0.35, 1.00, 0.42],
    [0.72, 0.68, -0.52, 0.42, 1.00]
  ];

  // Configuration du thème
  const plotTheme = {
    paper_bgcolor: isDarkMode ? '#1f2937' : '#ffffff',
    plot_bgcolor: isDarkMode ? '#1f2937' : '#ffffff',
    font: { color: isDarkMode ? '#e5e7eb' : '#1f2937' }
  };

  const gridColor = isDarkMode ? '#374151' : '#e5e7eb';

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Analyses Financières Avancées
      </h2>

      {/* Graphique Candlestick */}
      <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Évolution du Cours – CAC 40 ETF (Xtrackers) – du 1er au 12 janvier 2024
        </h3>
        <Plot
          data={[
            {
              type: 'candlestick',
              x: candlestickData.x,
              close: candlestickData.close,
              high: candlestickData.high,
              low: candlestickData.low,
              open: candlestickData.open,
              increasing: { line: { color: '#10b981' } },
              decreasing: { line: { color: '#ef4444' } },
              hovertemplate: candlestickData.x.map((date, i) => {
                const trend = candlestickData.close[i] > candlestickData.open[i] ? '▲' : '▼';
                const trendColor = candlestickData.close[i] > candlestickData.open[i] ? 'green' : 'red';
                return `<b>%{x}</b><br>` +
                       `Open: €%{open}<br>` +
                       `High: €%{high}<br>` +
                       `Low: €%{low}<br>` +
                       `Close: €%{close} <span style="color:${trendColor}">${trend}</span>` +
                       `<extra></extra>`;
              })
            }
          ]}
          layout={{
            ...plotTheme,
            xaxis: {
              gridcolor: gridColor,
              rangeslider: { visible: false },
              tickformat: '%d %b',
              tickmode: 'array',
              tickvals: candlestickData.x,
              ticktext: ['01 Jan', '02 Jan', '03 Jan', '04 Jan', '05 Jan', '08 Jan', '09 Jan', '10 Jan', '11 Jan', '12 Jan']
            },
            yaxis: {
              gridcolor: gridColor,
              title: 'Prix (€)'
            },
            height: 400,
            margin: { l: 60, r: 40, t: 40, b: 60 },
            hoverlabel: {
              bgcolor: isDarkMode ? 'rgba(55, 65, 81, 0.95)' : 'rgba(229, 231, 235, 0.95)',
              font: {
                size: 14,
                color: isDarkMode ? '#e5e7eb' : '#1f2937'
              },
              bordercolor: isDarkMode ? '#6b7280' : '#9ca3af'
            },
            annotations: [
              {
                text: 'Année 2024',
                showarrow: false,
                xref: 'paper',
                yref: 'paper',
                x: 0.5,
                y: -0.15,
                xanchor: 'center',
                font: {
                  size: 12,
                  color: isDarkMode ? '#9ca3af' : '#6b7280'
                }
              }
            ]
          }}
          config={{ displayModeBar: false, responsive: true }}
          className="w-full"
        />
        <div className={`mt-3 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} flex justify-center gap-4`}>
          <span>🟩 Bougie verte : hausse du jour</span>
          <span>|</span>
          <span>🟥 Bougie rouge : baisse du jour</span>
        </div>
      </div>

      {/* Heatmap */}
      <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Matrice de Corrélation des Actifs
        </h3>
        <Plot
          data={[
            {
              type: 'heatmap',
              z: correlationMatrix,
              x: heatmapLabels,
              y: heatmapLabels,
              colorscale: 'RdBu',
              reversescale: true,
              text: correlationMatrix.map(row =>
                row.map(val => val.toFixed(2))
              ),
              texttemplate: '%{text}',
              textfont: { size: 12 },
              hoverongaps: false
            }
          ]}
          layout={{
            ...plotTheme,
            height: 400,
            margin: { l: 80, r: 40, t: 40, b: 80 }
          }}
          config={{ displayModeBar: false, responsive: true }}
          className="w-full"
        />
      </div>

      {/* Waterfall */}
      <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Analyse des Revenus – Évolution entre Q4 2023 et Q1 2024
        </h3>
        <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Variation nette : +€740 000 (+29.6%)
        </p>
        <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          Ce graphique présente l'évolution du revenu entre Q4 2023 et Q1 2024...
        </p>
        <Plot
          data={[
            {
              type: 'waterfall',
              orientation: 'v',
              measure: waterfallData.map(d => d.type === 'total' ? 'total' : 'relative'),
              x: waterfallData.map(d => d.name),
              y: waterfallData.map(d => d.type === 'decrease' ? d.value : d.type === 'total' ? 0 : d.value),
              connector: { line: { color: gridColor } },
              increasing: { marker: { color: '#10b981' } },
              decreasing: { marker: { color: '#ef4444' } },
              totals: { marker: { color: '#3b82f6' } },
              textposition: 'none',
              hovertemplate: waterfallData.map((d, i) => {
                const sign = d.value >= 0 ? '+' : '';
                const variation = d.type === 'initial' ? '' : `<br>Variation: ${sign}€${Math.abs(d.value).toLocaleString()}`;
                const totalValue = i === 0 ? d.value :
                                  i === 1 ? 2950000 :
                                  i === 2 ? 3270000 :
                                  i === 3 ? 3090000 :
                                  i === 4 ? 3240000 :
                                  3240000;
                const total = d.type !== 'initial' ? `<br>Total: €${totalValue.toLocaleString()}` : '';
                return `<b>%{x}</b>${variation}${total}<extra></extra>`;
              })
            }
          ]}
          layout={{
            ...plotTheme,
            xaxis: {
              tickangle: -45,
              gridcolor: gridColor
            },
            yaxis: {
              gridcolor: gridColor,
              title: 'Montant (€)',
              tickformat: ',.0f',
              range: [0, 3800000]
            },
            height: 450,
            margin: { l: 80, r: 40, t: 100, b: 120 },
            showlegend: false,
            annotations: waterfallData.map((d, i) => ({
              x: d.name,
              y: 3600000,
              text: `<b>€${Math.abs(d.value).toLocaleString()}</b>`,
              showarrow: false,
              font: {
                size: 14,
                color: '#ffffff'
              },
              bgcolor: 'rgba(17, 17, 17, 0.85)',
              bordercolor: 'transparent',
              borderpad: 6,
              xpad: 8,
              ypad: 4,
              xanchor: 'center',
              yanchor: 'middle'
            })),
            shapes: [{
              type: 'line',
              x0: -0.5,
              x1: 5.5,
              y0: 3600000,
              y1: 3600000,
              line: {
                color: isDarkMode ? 'rgba(107, 114, 128, 0.3)' : 'rgba(209, 213, 219, 0.3)',
                width: 1,
                dash: 'dot'
              }
            }]
          }}
          config={{ displayModeBar: false, responsive: true }}
          className="w-full"
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <div key={index} className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {kpi.label}
            </h4>
            <p className={`text-2xl font-bold mt-2 ${kpi.status === 'good' ? 'text-green-500' : 'text-yellow-500'}`}>
              {kpi.value}
            </p>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Cible: {kpi.target}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialCharts;
