/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  Legend 
} from "recharts";
import { HistoricalState } from "../types";
import { PORTFOLIO_HISTORY } from "../data";

interface DashboardChartsProps {
  activeState: HistoricalState;
}

// Visual color palette defined in premium dark mode guide:
const SECTOR_COLORS = [
  "#0ea5e9", // Tech Cyan
  "#f59e0b", // Solar Amber
  "#10b981", // Emerald Green
  "#ec4899", // Vivid Pink
  "#a855f7", // Purple Accent
];

const TICKER_COLORS = {
  ITUB4: "#0ea5e9",
  TAEE11: "#f59e0b",
  WEGE3: "#10b981",
  VALE3: "#ec4899",
  PETR4: "#3b82f6"
};

export default function DashboardCharts({ activeState }: DashboardChartsProps) {
  
  // 1. Data mapping for Portfolio Value Evolution (Networth Timeline)
  const evolutionData = PORTFOLIO_HISTORY.map(st => {
    const totalValuation = st.ativos.reduce((sum, item) => sum + item.total, 0);
    return {
      date: st.data.substring(0, 5), // "28/03" out of "28/03/2026"
      "Patrimônio": parseFloat(totalValuation.toFixed(2)),
      "Total Aplicado": parseFloat(st.totalInvestidoAcumulado.toFixed(2))
    };
  });

  // 2. Data mapping for Sector Allocation Donut Chart (Dynamic)
  const sectorMap: { [key: string]: number } = {};
  activeState.ativos.forEach(at => {
    sectorMap[at.setor] = (sectorMap[at.setor] || 0) + at.total;
  });

  const totalPortfolioValue = activeState.ativos.reduce((sum, item) => sum + item.total, 0);

  const sectorData = Object.keys(sectorMap).map(sect => {
    const value = parseFloat(sectorMap[sect].toFixed(2));
    const percentage = parseFloat(((value / totalPortfolioValue) * 100).toFixed(2));
    return {
      name: sect,
      value,
      percentage
    };
  }).sort((a,b) => b.value - a.value);

  // 3. Data mapping for asset composition bar chart (Horizontal bar)
  const assetData = activeState.ativos.map(at => ({
    ticker: at.ticker,
    "Valor R$": parseFloat(at.total.toFixed(2)),
    avgPrice: at.cotacao,
    quantity: at.qtd,
    fill: TICKER_COLORS[at.ticker as keyof typeof TICKER_COLORS] || "#0ea5e9"
  })).sort((a,b) => b["Valor R$"] - a["Valor R$"]);

  // Format currency helpers for Charts
  const formatYAxis = (val: number) => {
    if (val >= 1000) return `R$ ${(val / 1000).toFixed(1)}k`;
    return `R$ ${val}`;
  };

  const formatTooltipValue = (value: any) => {
    return [new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value))];
  };

  return (
    <div id="dashboard-charts-grid" className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      
      {/* Evolution Area Chart */}
      <div 
        id="chart-card-evolution" 
        className="bg-[#1a1a24] p-6 rounded-[14px] border border-[rgba(255,255,255,0.05)] transition-all duration-300 hover:border-[rgba(14,165,233,0.2)]"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <h3 id="chart-title-evolution" className="text-[15px] font-bold text-white tracking-tight">
              Evolução Patrimonial
            </h3>
            <span className="text-[11px] text-gray-400 mt-1">Comparação histórica de patrimônio vs. aporte</span>
          </div>
          <span className="text-xs text-[#0ea5e9] bg-[rgba(14,165,233,0.1)] px-2.5 py-0.5 rounded-full font-medium">Histórico B3</span>
        </div>
        
        <div className="w-full h-[300px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={evolutionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                fontSize={11}
                tickLine={false}
                axisLine={false}
                dy={8}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={11}
                tickFormatter={formatYAxis}
                tickLine={false}
                axisLine={false}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#1e1e2d", 
                  borderColor: "rgba(255, 255, 255, 0.1)", 
                  borderRadius: "10px", 
                  fontFamily: "'Space Grotesk', sans-serif" 
                }}
                labelStyle={{ color: "#94a3b8", fontWeight: "bold" }}
                formatter={formatTooltipValue}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: "11px", fontFamily: "'Space Grotesk', sans-serif" }} />
              <Area 
                type="monotone" 
                dataKey="Patrimônio" 
                stroke="#0ea5e9" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#cyanGradient)" 
              />
              <Area 
                type="monotone" 
                dataKey="Total Aplicado" 
                stroke="#f59e0b" 
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fill="none" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dynamic Sector allocation Donut */}
      <div 
        id="chart-card-sector" 
        className="bg-[#1a1a24] p-6 rounded-[14px] border border-[rgba(255,255,255,0.05)] transition-all duration-300 hover:border-[rgba(16,185,129,0.2)]"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <h3 id="chart-title-sector" className="text-[15px] font-bold text-white tracking-tight">
              Distribuição por Setor Econômico
            </h3>
            <span className="text-[11px] text-gray-400 mt-1">Percentual atual alocado por área econômica</span>
          </div>
          <span className="text-xs text-[#10b981] bg-[rgba(16,185,129,0.1)] px-2.5 py-0.5 rounded-full font-medium">Diversificação</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-4 mt-6 h-[270px]">
          {/* Donut graphic */}
          <div className="col-span-1 md:col-span-2 h-full flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SECTOR_COLORS[index % SECTOR_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#1e1e2d", 
                    borderColor: "rgba(255, 255, 255, 0.1)", 
                    borderRadius: "10px", 
                    fontFamily: "'Space Grotesk', sans-serif" 
                  }}
                  formatter={formatTooltipValue}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Visual Legends list */}
          <div className="col-span-1 md:col-span-3 space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {sectorData.map((sect, i) => {
              const color = SECTOR_COLORS[i % SECTOR_COLORS.length];
              return (
                <div key={sect.name} className="flex items-center justify-between p-2 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.02)]">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-xs text-gray-300 truncate font-sans" title={sect.name}>
                      {sect.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 text-right">
                    <span className="text-xs font-semibold text-white font-sans [font-variant-numeric:tabular-nums]">
                      {sect.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Asset Composition chart (Horizontal Bar Chart) */}
      <div 
        id="chart-card-asset-comp" 
        className="bg-[#1a1a24] p-6 rounded-[14px] border border-[rgba(255,255,255,0.05)] transition-all duration-300 hover:border-[rgba(245,158,11,0.2)] lg:col-span-2"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <h3 id="chart-title-composition" className="text-[15px] font-bold text-white tracking-tight">
              Investimento por Ativo (Ticker)
            </h3>
            <span className="text-[11px] text-gray-400 mt-1">Volume financeiro líquido alocado em cada empresa</span>
          </div>
          <span className="text-xs text-[#f59e0b] bg-[rgba(245,158,11,0.1)] px-2.5 py-0.5 rounded-full font-medium">Ativos Individuais</span>
        </div>

        <div className="w-full h-[280px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={assetData}
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" horizontal={false} />
              <XAxis 
                type="number" 
                stroke="#64748b" 
                fontSize={11}
                tickFormatter={(v) => `R$ ${v}`}
                tickLine={false}
                axisLine={false}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              />
              <YAxis 
                type="category" 
                dataKey="ticker" 
                stroke="#ffffff" 
                fontSize={12}
                fontWeight="600"
                tickLine={false}
                axisLine={false}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: "#1e1e2d", 
                  borderColor: "rgba(255, 255, 255, 0.1)", 
                  borderRadius: "10px", 
                  fontFamily: "'Space Grotesk', sans-serif" 
                }}
                formatter={formatTooltipValue}
              />
              <Bar 
                dataKey="Valor R$" 
                radius={[0, 6, 6, 0]} 
                barSize={18}
              >
                {assetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
    </div>
  );
}
