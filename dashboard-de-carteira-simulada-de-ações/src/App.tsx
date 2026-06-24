/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Settings, 
  Clock, 
  Search, 
  TrendingUp, 
  Award, 
  Coins, 
  HelpCircle, 
  Activity, 
  Bell, 
  User, 
  Calendar as CalendarIcon,
  Layers,
  Sparkles,
  Info,
  DollarSign,
  ArrowUpRight,
  Monitor,
  RotateCcw,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronLeft,
  ChevronRight,
  BarChart2,
  CalendarDays
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import IndicatorRing from "./components/IndicatorRing";
import { SECTOR_BENCHMARKS, PORTFOLIO_HISTORY } from "./data";

interface SimulatedAsset {
  ticker: string;
  empresa: string;
  setor: string;
  cotacao: number;
  qtd: number;
  precoMedio: number;
  color: string;
}

export default function App() {
  // Ambient Outer frame theme selection matching custom screens backgrounds
  const [ambientTheme, setAmbientTheme] = useState<"orange" | "green" | "dark">("dark");
  
  // Custom display view switcher inside the device matches Image 1 vs Image 2/3
  const [visualMode, setVisualMode] = useState<"lite" | "dark">("lite");

  // Collapsible custody sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Selected day in calendar events
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(4);

  // Tab controls
  const [activeTab, setActiveTab] = useState<"assets" | "ledger" | "benchmarks">("assets");

  // Real responsive time state
  const [currentTime, setCurrentTime] = useState<string>("09:42:00");
  const [countdown, setCountdown] = useState<number>(40);

  // Search filter
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Simulated live active assets (initialized from the official portfolio logs)
  const [simulatedAssets, setSimulatedAssets] = useState<SimulatedAsset[]>([
    { ticker: "ITUB4", empresa: "Itaú Unibanco", setor: "Financeiro (Bancário)", cotacao: 40.60, qtd: 13, precoMedio: 41.40, color: "bg-[#f97316]" },
    { ticker: "TAEE11", empresa: "Taesa S.A.", setor: "Energia Elétrica (Transmissão)", cotacao: 39.69, qtd: 4, precoMedio: 41.11, color: "bg-[#ea580c]" },
    { ticker: "WEGE3", empresa: "WEG S.A.", setor: "Indústria (Bens de Capital)", cotacao: 42.44, qtd: 3, precoMedio: 47.41, color: "bg-[#16a34a]" },
    { ticker: "PETR4", empresa: "Petrobras S.A.", setor: "Petróleo e Gás", cotacao: 41.04, qtd: 6, precoMedio: 49.41, color: "bg-[#0d9488]" },
    { ticker: "VALE3", empresa: "Vale S.A.", setor: "Mineração (Commodities)", cotacao: 79.17, qtd: 1, precoMedio: 53.00, color: "bg-[#6b7280]" }
  ]);

  // Selected Stock Asset for detail monitoring
  const [selectedTicker, setSelectedTicker] = useState<string>("ITUB4");

  // Simulated cash available
  const [simulatedCash, setSimulatedCash] = useState<number>(10.40);

  // Simulated alert notification banner
  const [showNotification, setShowNotification] = useState<boolean>(true);
  const [notificationMsg, setNotificationMsg] = useState<string>(
    "Reconciação de Custódia em Tempo Real — Todos os preços foram recarregados com sucesso"
  );

  // Historical transactions log state
  const [transactionsHistory, setTransactionsHistory] = useState([
    { data: "28/03/2026", ticker: "ITUB4", tipo: "COMPRA", qtd: 3, precoUnit: 41.40, total: 124.20 },
    { data: "28/03/2026", ticker: "TAEE11", tipo: "COMPRA", qtd: 3, precoUnit: 41.11, total: 123.33 },
    { data: "28/03/2026", ticker: "WEGE3", tipo: "COMPRA", qtd: 1, precoUnit: 47.41, total: 47.41 },
    { data: "28/03/2026", ticker: "VALE3", tipo: "COMPRA", qtd: 2, precoUnit: 53.00, total: 106.00 },
    { data: "28/03/2026", ticker: "PETR4", tipo: "COMPRA", qtd: 2, precoUnit: 49.41, total: 98.82 },
    { data: "30/04/2026", ticker: "ITUB4", tipo: "COMPRA", qtd: 10, precoUnit: 44.37, total: 443.70 },
    { data: "30/05/2026", ticker: "VALE3", tipo: "VENDA (LUCRO)", qtd: -1, precoUnit: 82.00, total: 82.00 },
    { data: "30/05/2026", ticker: "PETR4", tipo: "COMPRA", qtd: 3, precoUnit: 31.46, total: 94.38 },
    { data: "30/05/2026", ticker: "WEGE3", tipo: "COMPRA", qtd: 2, precoUnit: 42.50, total: 85.00 },
    { data: "13/06/2026", ticker: "TAEE11", tipo: "COMPRA", qtd: 1, precoUnit: 39.69, total: 39.69 }
  ]);

  // Form input states
  const [formTicker, setFormTicker] = useState<string>("BBAS3");
  const [formQtd, setFormQtd] = useState<number>(5);
  const [formPrice, setFormPrice] = useState<number>(27.50);
  const [formSector, setFormSector] = useState<string>("Financeiro (Bancário)");

  // Clock ticks
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, "0");
      const mins = String(now.getMinutes()).padStart(2, "0");
      const secs = String(now.getSeconds()).padStart(2, "0");
      setCurrentTime(`${hrs}:${mins}:${secs}`);
      
      setCountdown((prev) => (prev <= 1 ? 40 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Recalculations
  const totalInvestedValue = simulatedAssets.reduce((sum, item) => sum + (item.precoMedio * item.qtd), 0);
  const currentAssetsValue = simulatedAssets.reduce((sum, item) => sum + (item.cotacao * item.qtd), 0);
  const totalPortfolioValue = currentAssetsValue + simulatedCash;
  const currentNetReturnVal = currentAssetsValue - totalInvestedValue;
  const currentNetReturnPercent = totalInvestedValue > 0 ? (currentNetReturnVal / totalInvestedValue) * 100 : 0;

  // Handler to add custom simulated purchase and process cost-averaging logic dynamically!
  const handleAddSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTicker || formQtd <= 0 || formPrice <= 0) return;

    const formattedTicker = formTicker.toUpperCase().trim();
    const cost = formPrice * formQtd;

    // Append to transactions array
    const newTx = {
      data: new Date().toLocaleDateString("pt-BR"),
      ticker: formattedTicker,
      tipo: "COMPRA",
      qtd: formQtd,
      precoUnit: formPrice,
      total: cost
    };

    setTransactionsHistory([newTx, ...transactionsHistory]);

    // Check if asset exists in portfolio already to average the price
    const existingIndex = simulatedAssets.findIndex(a => a.ticker === formattedTicker);
    if (existingIndex !== -1) {
      const existing = simulatedAssets[existingIndex];
      const newTotalQtd = existing.qtd + formQtd;
      const newPrecoMedio = ((existing.precoMedio * existing.qtd) + (formPrice * formQtd)) / newTotalQtd;
      
      const updated = [...simulatedAssets];
      updated[existingIndex] = {
        ...existing,
        qtd: newTotalQtd,
        precoMedio: parseFloat(newPrecoMedio.toFixed(2)),
        // Cotacao might fluctuate or be set to requested price
        cotacao: formPrice
      };
      setSimulatedAssets(updated);
    } else {
      // Add fresh asset
      const randomColors = ["bg-[#ef4444]", "bg-[#3b82f6]", "bg-[#8b5cf6]", "bg-[#ec4899]", "bg-[#f59e0b]"];
      const newAsset: SimulatedAsset = {
        ticker: formattedTicker,
        empresa: `Fundo Co. ${formattedTicker}`,
        setor: formSector,
        cotacao: formPrice,
        qtd: formQtd,
        precoMedio: formPrice,
        color: randomColors[Math.floor(Math.random() * randomColors.length)]
      };
      setSimulatedAssets([...simulatedAssets, newAsset]);
    }

    setNotificationMsg(`Ordem executada com sucesso: +${formQtd} un de ${formattedTicker}!`);
    setShowNotification(true);
  };

  // Handler to simulate selling or deleting an asset completely
  const handleDeleteAsset = (tickerToDelete: string) => {
    const assetObj = simulatedAssets.find(a => a.ticker === tickerToDelete);
    if (!assetObj) return;

    // Simulate returning money to cash balance
    const recoveredCash = assetObj.cotacao * assetObj.qtd;
    setSimulatedCash(prev => prev + recoveredCash);

    // Remove from active stack
    setSimulatedAssets(simulatedAssets.filter(a => a.ticker !== tickerToDelete));

    // Register sale in transactions log
    const saleTx = {
      data: new Date().toLocaleDateString("pt-BR"),
      ticker: tickerToDelete,
      tipo: "VENDA (SIMULADA)",
      qtd: -assetObj.qtd,
      precoUnit: assetObj.cotacao,
      total: recoveredCash
    };
    setTransactionsHistory([saleTx, ...transactionsHistory]);
    setNotificationMsg(`Ativo ${tickerToDelete} desalocado do portfólio. Caixa creditado em R$ ${recoveredCash.toFixed(2)}`);
    setShowNotification(true);
  };

  // Handler to restore initial database mock weights
  const resetPortfolioModel = () => {
    setSimulatedAssets([
      { ticker: "ITUB4", empresa: "Itaú Unibanco", setor: "Financeiro (Bancário)", cotacao: 40.60, qtd: 13, precoMedio: 41.40, color: "bg-[#f97316]" },
      { ticker: "TAEE11", empresa: "Taesa S.A.", setor: "Energia Elétrica (Transmissão)", cotacao: 39.69, qtd: 4, precoMedio: 41.11, color: "bg-[#ea580c]" },
      { ticker: "WEGE3", empresa: "WEG S.A.", setor: "Indústria (Bens de Capital)", cotacao: 42.44, qtd: 3, precoMedio: 47.41, color: "bg-[#16a34a]" },
      { ticker: "PETR4", empresa: "Petrobras S.A.", setor: "Petróleo e Gás", cotacao: 41.04, qtd: 6, precoMedio: 49.41, color: "bg-[#0d9488]" },
      { ticker: "VALE3", empresa: "Vale S.A.", setor: "Mineração (Commodities)", cotacao: 79.17, qtd: 1, precoMedio: 53.00, color: "bg-[#6b7280]" }
    ]);
    setSimulatedCash(10.40);
    setNotificationMsg("Parâmetros originais do portfólio restaurados!");
    setShowNotification(true);
  };

  // Selected Stock detailed parameters
  const selectedAssetObj = simulatedAssets.find(a => a.ticker === selectedTicker) || simulatedAssets[0];

  const getFilteredAssets = () => {
    if (!searchQuery) return simulatedAssets;
    return simulatedAssets.filter(
      a => a.ticker.toLowerCase().includes(searchQuery.toLowerCase()) || 
           a.setor.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Group assets by sector dynamically for the Donuts chart and side legend lists
  const sectorAllocData = Object.entries(
    simulatedAssets.reduce((acc, item) => {
      const currentVal = item.cotacao * item.qtd;
      acc[item.setor] = (acc[item.setor] || 0) + currentVal;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, valueVal]) => {
    const value = valueVal as number;
    const percentage = currentAssetsValue > 0 ? (value / currentAssetsValue) * 100 : 0;
    const colors: Record<string, string> = {
      "Financeiro (Bancário)": "#f97316",
      "Energia Elétrica (Transmissão)": "#ea580c",
      "Indústria (Bens de Capital)": "#16a34a",
      "Petróleo e Gás": "#0d9488",
      "Mineração (Commodities)": "#6b7280"
    };
    return {
      name,
      value,
      percentage,
      color: colors[name] || "#a855f7"
    };
  });

  return (
    <div className="min-h-screen md:h-screen w-screen bg-[#07070b] text-[#f4f4f8] flex flex-col md:flex-row select-none overflow-hidden font-sans relative">
        


        {/* 1. SLIM LEFT RAIL (70px Width) - Matches Image 1-3 */}
        <div 
          id="mock-slim-left-rail" 
          className="w-full md:w-[76px] bg-[#0c0c12] border-b md:border-b-0 md:border-r border-[rgba(255,255,255,0.04)] flex md:flex-col items-center justify-between py-4 px-3 md:py-6 md:h-screen md:sticky md:top-0 md:overflow-y-auto"
        >
          {/* Logo */}
          <div className="flex md:flex-col items-center gap-2">
            <div 
              id="c-monogram-logo"
              className="w-11 h-11 rounded-full text-white flex items-center justify-center font-bold text-xl font-sans cursor-pointer transition-transform hover:opacity-90"
              style={{ backgroundColor: "#F05634" }}
              onClick={resetPortfolioModel}
              title="Restaurar Padrão do Portfólio"
            >
              C
            </div>
            
            <div className="text-[9px] text-gray-500 uppercase tracking-widest font-sans font-bold select-none text-center hidden md:block mt-1">
              Stats
            </div>
          </div>

          {/* Navigation with high-fidelity indicators (Yellow active dot background matching Russian mockup) */}
          <div className="flex md:flex-col items-center gap-4 py-2">
            
            {/* Dashboard active tile widget */}
            <button
              id="rail-nav-dashboard"
              onClick={() => setActiveTab("assets")}
              className={`w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                activeTab === "assets"
                  ? "bg-[#fbbf24] text-black shadow-lg scale-110"
                  : "bg-[#181824] text-gray-400 hover:text-white hover:bg-[#20202f]"
              }`}
              title="Painel de Ativos"
            >
              <Activity size={18} />
            </button>

            {/* Ledger Transactions table clicker */}
            <button
              id="rail-nav-ledger"
              onClick={() => setActiveTab("ledger")}
              className={`w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                activeTab === "ledger"
                  ? "bg-[#fbbf24] text-black shadow-lg scale-110"
                  : "bg-[#181824] text-gray-400 hover:text-white hover:bg-[#20202f]"
              }`}
              title="Histórico de Extratos"
            >
              <Coins size={18} />
            </button>

            {/* Benchmarks metrics comparison picker */}
            <button
              id="rail-nav-benchmarks"
              onClick={() => {
                setActiveTab("benchmarks");
              }}
              className={`w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                activeTab === "benchmarks"
                  ? "bg-[#fbbf24] text-black shadow-lg scale-110"
                  : "bg-[#181824] text-gray-400 hover:text-white hover:bg-[#20202f]"
              }`}
              title="Benchmarks Fundamentais B3"
            >
              <Award size={18} />
            </button>
          </div>

          {/* User profile footer - circular avatar matches Tarsis profile picture indicator perfectly */}
          <div className="flex md:flex-col items-center gap-3">
            
            {/* Real notification interactive mini toggle */}
            <div className="relative">
              <button
                id="rail-interactive-bell"
                onClick={() => {
                  setNotificationMsg("Acesso rápido sincronizado com a B3 Oficial.");
                  setShowNotification(true);
                }}
                className="w-9 h-9 rounded-full bg-[#181824] flex items-center justify-center text-gray-300 hover:text-white"
              >
                <Bell size={14} />
              </button>
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-black absolute -top-0.5 -right-0.5 animate-pulse" />
            </div>

            <div className="relative group">
              <div 
                id="rail-user-avatar"
                className="w-11 h-11 rounded-full bg-white border-2 border-white/25 hover:scale-105 hover:border-orange-400 transition-all cursor-pointer flex items-center justify-center font-bold text-slate-950 font-sans shadow-[0_0_15px_rgba(255,255,255,0.35)]"
                title="Tarsis William (tarsis.william@discente.ufma.br)"
              >
                TW
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full" />
              
              {/* Tooltip detail block */}
              <div className="absolute left-[70px] bottom-1 bg-[#12121a] text-white text-xs p-3 rounded-xl border border-white/10 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-350 shadow-2xl z-50 whitespace-nowrap">
                <p className="font-bold">Investidor: Tarsis William</p>
                <p className="text-[10px] text-gray-400 mt-1">tarsis.william@discente.ufma.br</p>
              </div>
            </div>

          </div>
        </div>

        {/* 2. INNER LEFT COLUMN (330px Width) - DECK OF STOCK INDICATOR CARDS (Collapsible) */}
        <div 
          id="mock-inner-deck-sidebar" 
          className={`bg-[#0f0f15] border-r border-[rgba(255,255,255,0.04)] flex flex-col transition-all duration-300 ease-in-out shrink-0 md:h-screen md:sticky md:top-0 md:overflow-hidden ${
            isSidebarCollapsed 
              ? "w-0 opacity-0 border-r-0 pointer-events-none" 
              : "w-full md:w-[330px] opacity-100"
          }`}
        >
          {/* Header section of Deck Drawer */}
          <div className="p-5 border-b border-[rgba(255,255,255,0.04)] bg-[#09090c]">
            <div className="flex items-center justify-between text-xs mb-3">
              <div className="flex items-center gap-1.5 text-gray-400 font-bold uppercase tracking-wider font-sans">
                <Layers size={13} className="text-[#fb923c]" />
                <span>Ativos Custódia</span>
              </div>
              <div className="flex items-center gap-1 bg-[#fb923c]/20 text-[#fb923c] font-sans font-extrabold px-2 py-0.5 rounded-full text-[10px]">
                {simulatedAssets.length} un
              </div>
            </div>

            {/* Quick search inside the active assets */}
            <div className="relative mt-2">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none">
                <Search size={12} />
              </span>
              <input
                id="deck-search-query-field"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtrar por ticker..."
                className="w-full bg-[#181824] border border-white/5 rounded-xl pl-8.5 pr-4 py-2 text-[11px] text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition-colors"
              />
            </div>
          </div>

          {/* Cards vertical stack */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 max-h-[500px] md:max-h-[calc(100vh-100px)]">
            {getFilteredAssets().length > 0 ? (
              getFilteredAssets().map((item) => {
                const totalAssetPrice = item.cotacao * item.qtd;
                const profitAsset = (item.cotacao - item.precoMedio) * item.qtd;
                const isProfit = profitAsset >= 0;
                const isSelected = item.ticker === selectedTicker;

                return (
                  <div
                    id={`asset-deck-tile-${item.ticker}`}
                    key={item.ticker}
                    onClick={() => {
                      setSelectedTicker(item.ticker);
                      // Auto route back to dashboard views to show details
                      if (activeTab !== "assets") setActiveTab("assets");
                    }}
                    className={`p-[18px] rounded-[24px] cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between group ${item.color} ${
                      isSelected 
                        ? "ring-4 ring-white/90 scale-98 shadow-xl" 
                        : "opacity-85 hover:opacity-100 hover:scale-[1.01]"
                    }`}
                  >
                    {/* Top line identifier */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="bg-black/25 text-white/90 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {item.ticker}
                        </span>
                        
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        )}
                      </div>
                      
                      {/* Interactive Delete/Sell option inside ticker card matching red garbage can */}
                      <button
                        id={`delete-asset-btn-${item.ticker}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAsset(item.ticker);
                        }}
                        className="text-white/60 hover:text-white p-1 rounded-md hover:bg-black/20 transition-colors"
                        title="Vender total deste ativo"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Numeric body values matching Russian layout typography exactly */}
                    <div className="mt-4 flex items-end justify-between">
                      <div className="flex flex-col text-white">
                        <span className="text-xl font-black font-sans leading-none tracking-tight [font-variant-numeric:tabular-nums]">
                          R$ {item.cotacao.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-white/70 font-sans tracking-wide mt-1 font-medium">
                          Preço Médio: R$ {item.precoMedio.toFixed(2)}
                        </span>
                      </div>

                      {/* Side custom circle value mimicking indicator circles */}
                      <div className="text-right text-white">
                        <span className="text-xs font-bold font-sans [font-variant-numeric:tabular-nums] block">
                          {item.qtd} un
                        </span>
                        <span className="text-[10px] font-bold bg-white/20 px-1.5 py-0.5 rounded-md mt-1 block">
                          Total R$ {totalAssetPrice.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    {/* Card stats ribbon bottom */}
                    <div className="mt-3.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/90 font-sans">
                      <span className="truncate pr-2">{item.empresa}</span>
                      <span className={`font-bold ${isProfit ? "text-green-200" : "text-red-200"}`}>
                        {isProfit ? "+" : ""}R$ {profitAsset.toFixed(2)}
                      </span>
                    </div>

                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 text-gray-500 font-sans text-xs">
                Nenhum ativo encontrado com esse termo.
              </div>
            )}

            {/* Simulated addition shortcut button */}
            <div className="p-4 bg-[rgba(255,255,255,0.02)] border border-dashed border-white/10 rounded-[20px] text-center text-xs text-gray-400 font-sans">
              <span>Selecione um card para realizar a análise fundamentalista detalhada.</span>
            </div>
          </div>

        </div>

        {/* 3. DYNAMIC RIGHT CONTENT WORKSPACE AREA */}
        {/* Contains visual switcher inside the mockup to toggle between:
            a) White premium workspace with massive stats columns (Images 2/3)
            b) Deep black grid layout with glowing neon concentric gauges (Image 1) */}
        <div id="mock-main-workspace" className="flex-1 bg-[#13131a] flex flex-col overflow-hidden min-h-[500px]">
          
          {/* Top controlling action bar */}
          <div className="p-5 border-b border-[rgba(255,255,255,0.04)] bg-[#0b0b0e] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* View status indicators and Sidebar Toggle */}
            <div className="flex items-center gap-3">
              <button
                id="sidebar-toggle-trigger"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-2.5 bg-[#181824] hover:bg-[#222235] border border-white/5 rounded-xl text-gray-300 hover:text-white transition-all cursor-pointer flex items-center justify-center shadow-md active:scale-95"
                title={isSidebarCollapsed ? "Expandir Ativos" : "Recolher Ativos"}
              >
                {isSidebarCollapsed ? <PanelLeftOpen size={16} className="text-[#fb923c]" /> : <PanelLeftClose size={16} />}
              </button>
              <div className="w-10 h-10 rounded-xl bg-orange-400/20 flex items-center justify-center text-orange-400">
                <Sparkles size={18} />
              </div>
              <div className="flex flex-col">
                <h2 className="text-xs font-black text-white tracking-wider uppercase font-sans">
                  Sinalizador Consolidado Geral B3
                </h2>
                <span className="text-[10px] text-gray-400 mt-0.5 select-none">
                  Controle Geral de Portfólio, Rendimentos e Simulação Financeira
                </span>
              </div>
            </div>

            {/* Visual View Presets Switcher matches style guidelines perfectly */}
            <div className="flex bg-[#1a1a26] p-1 rounded-2xl border border-white/5 select-none self-start lg:self-auto">
              <button
                id="switch-mode-lite"
                onClick={() => setVisualMode("lite")}
                className={`flex items-center gap-2 px-3 py-2 text-[11px] font-bold rounded-xl transition-all ${
                  visualMode === "lite"
                    ? "bg-white text-black shadow-md"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <span>🔲 Visualização LITE (IMGS 2/3)</span>
              </button>
              
              <button
                id="switch-mode-dark"
                onClick={() => setVisualMode("dark")}
                className={`flex items-center gap-2 px-3 py-2 text-[11px] font-bold rounded-xl transition-all ${
                  visualMode === "dark"
                    ? "bg-amber-400 text-black shadow-md"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <span>🔳 Visualização DARK (IMG 1)</span>
              </button>
            </div>

          </div>

          {/* Main workspace frame rendered in dual style mode */}
          {visualMode === "lite" ? (
            <div id="workspace-view-lite" className="flex-1 bg-[#09090e] p-6 text-slate-100 overflow-y-auto max-h-[calc(100vh-80px)] space-y-6">
              {/* Top Alert Banner */}
              {showNotification && (
                <div className="bg-[#fb923c]/10 border border-[#fb923c]/20 rounded-2xl p-4 flex items-center justify-between text-xs text-[#fdba74] animate-fade-in shadow-inner">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
                    <span className="font-bold text-orange-400">🔔 Alerta Ativo:</span>
                    <span className="font-medium text-gray-300">{notificationMsg}</span>
                  </div>
                  <button 
                    onClick={() => setShowNotification(false)}
                    className="font-bold text-orange-400 hover:text-orange-500 p-1 bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* KPI DASHBOARD HEADER GRID (from images - 6 columns of responsive KPI blocks) */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 select-none" id="dashboard-metric-capsules">
                
                {/* Cap 1: Patrimônio */}
                <div className="bg-[#12121a] p-4 rounded-2xl border border-white/5 shadow-md flex flex-col justify-between">
                  <span className="text-[10px] text-gray-400 uppercase font-sans tracking-wider">Patrimônio Consolidado</span>
                  <span className="text-[17px] font-black text-white mt-1">R$ {totalPortfolioValue.toFixed(2)}</span>
                  <span className="text-[9px] text-[#fb923c] font-bold mt-1 font-sans">Total Geral</span>
                </div>

                {/* Cap 2: Saldo Caixa */}
                <div className="bg-[#12121a] p-4 rounded-2xl border border-white/5 shadow-md flex flex-col justify-between">
                  <span className="text-[10px] text-gray-400 uppercase font-sans tracking-wider">Saldo Caixa</span>
                  <span className="text-[17px] font-black text-white mt-1">R$ {simulatedCash.toFixed(2)}</span>
                  <span className="text-[9px] text-green-400 font-bold mt-1 font-sans">Pronto p/ Compras</span>
                </div>

                {/* Cap 3: Rentabilidade */}
                <div className="bg-[#12121a] p-4 rounded-2xl border border-white/5 shadow-md flex flex-col justify-between">
                  <span className="text-[10px] text-gray-400 uppercase font-sans tracking-wider">Rentabilidade</span>
                  <span className={`text-[17px] font-black mt-1 ${currentNetReturnPercent >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {currentNetReturnPercent >= 0 ? "+" : ""}{currentNetReturnPercent.toFixed(2)}%
                  </span>
                  <span className="text-[9px] text-gray-400 mt-1 font-sans">Nominal do Portfólio</span>
                </div>

                {/* Cap 4: Ativos em Custódia */}
                <div className="bg-[#12121a] p-4 rounded-2xl border border-white/5 shadow-md flex flex-col justify-between">
                  <span className="text-[10px] text-gray-400 uppercase font-sans tracking-wider">Ativos Individuais</span>
                  <span className="text-[17px] font-black text-white mt-1">{simulatedAssets.length} papéis</span>
                  <span className="text-[9px] text-blue-400 font-bold mt-1 font-sans">B3 Custódia</span>
                </div>

                {/* Cap 5: Valor Alocado */}
                <div className="bg-[#12121a] p-4 rounded-2xl border border-white/5 shadow-md flex flex-col justify-between">
                  <span className="text-[10px] text-gray-400 uppercase font-sans tracking-wider">Valor Alocado</span>
                  <span className="text-[17px] font-black text-white mt-1 font-sans">R$ {currentAssetsValue.toFixed(2)}</span>
                  <span className="text-[9px] text-amber-400 font-bold mt-1 font-sans">Custo Estimado</span>
                </div>

                {/* Cap 6: Margem de Graham */}
                <div className="bg-[#12121a] p-4 rounded-2xl border border-white/5 shadow-md flex flex-col justify-between">
                  <span className="text-[10px] text-gray-400 uppercase font-sans tracking-wider">Graham Score</span>
                  <span className="text-[17px] font-black text-amber-400 mt-1 font-sans font-bold">Excelente</span>
                  <span className="text-[9px] text-gray-500 mt-1 font-sans">B3 Alinhado</span>
                </div>

              </div>

              {/* Toggle Content block representing detailed layout panels */}
              <div className="mt-8">
                
                {activeTab === "assets" && (
                  <div id="lite-assets-view" className="space-y-6">
                    {/* BENTO GRID ROW 1 */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* 1. CHART CONTAINER: EVOLUÇÃO PATRIMONIAL */}
                      <div className="lg:col-span-2 bg-[#0d0d12] border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="text-xs font-black text-white uppercase tracking-wider font-sans flex items-center gap-1.5">
                                <TrendingUp size={14} className="text-[#fb923c]" />
                                Histórico de Rentabilidade de Carteira
                              </h4>
                              <span className="text-[10px] text-gray-400 font-sans">
                                Comparativo entre Capital Injetado (Aportes) vs. Valor Residual Custodiado
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-bold text-green-400">
                                +{((currentAssetsValue - 1499.76) / 1499.76 * 100).toFixed(2)}% total
                              </span>
                            </div>
                          </div>

                          <div className="h-[240px] w-full mt-4 font-mono text-[9px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={PORTFOLIO_HISTORY.map(h => ({
                                date: h.data,
                                patrimônio: h.ativos.reduce((sum, item) => sum + (item.cotacao * item.qtd), 0),
                                aportado: h.aporteAcumulado
                              }))} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                  <linearGradient id="colorPatrimonio" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#fb923c" stopOpacity={0.25}/>
                                    <stop offset="95%" stopColor="#fb923c" stopOpacity={0}/>
                                  </linearGradient>
                                  <linearGradient id="colorAportado" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6b7280" stopOpacity={0.15}/>
                                    <stop offset="95%" stopColor="#6b7280" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} />
                                <YAxis stroke="#94a3b8" fontSize={9} tickFormatter={(v) => `R$ ${v}`} />
                                <RechartsTooltip 
                                  contentStyle={{ backgroundColor: "#12121e", borderColor: "rgba(255,255,255,0.08)", borderRadius: "12px", color: "#fff", fontSize: "11px" }}
                                  formatter={(value: any) => [`R$ ${Number(value).toFixed(2)}`, ""]}
                                />
                                <Area type="monotone" dataKey="patrimônio" name="Val. Patrimônio" stroke="#fb923c" strokeWidth={2} fillOpacity={1} fill="url(#colorPatrimonio)" />
                                <Area type="monotone" dataKey="aportado" name="Aportado" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorAportado)" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>

                      {/* 2. DONUT / PIE CONTAINER: DISTRIBUIÇÃO POR SETOR */}
                      <div className="bg-[#0d0d12] border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-black text-white uppercase tracking-wider font-sans flex items-center gap-1.5 mb-2">
                             <Layers size={14} className="text-[#ea580c]" />
                             Composição de Carteira por Setor
                          </h4>
                          <span className="text-[10px] text-gray-400 font-sans block mb-4">
                            Composição de ativos por nicho macro econômico
                          </span>

                          <div className="h-[140px] flex items-center justify-center relative">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={sectorAllocData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={38}
                                  outerRadius={55}
                                  paddingAngle={4}
                                  dataKey="value"
                                >
                                  {sectorAllocData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <RechartsTooltip
                                  formatter={(value: any) => [`R$ ${Number(value).toFixed(2)}`]}
                                  contentStyle={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "10px", color: "#fff" }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute text-center select-none pointer-events-none">
                              <span className="text-[9px] text-gray-400 block uppercase tracking-widest text-[8px]">Total</span>
                              <span className="text-xs font-black text-white font-sans mt-0.5">
                                R$ {currentAssetsValue.toFixed(0)}
                              </span>
                            </div>
                          </div>

                          {/* Sector Allocation list indicators matching design system and Image 2 */}
                          <div className="space-y-2 mt-4">
                            {sectorAllocData.map((sector) => (
                              <div key={sector.name} className="flex items-center justify-between text-[11px] font-sans">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: sector.color }} />
                                  <span className="text-gray-300 truncate font-semibold" title={sector.name}>
                                    {sector.name.split(" ")[0]}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 font-mono text-gray-200">
                                  <span>{sector.percentage.toFixed(1)}%</span>
                                  <span className="text-[9px] text-gray-500">({(sector.value / 100).toFixed(1)}k)</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* BENTO GRID ROW 2 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                      {/* 1. ASSET LIST PROPORTIONS AND SPECIFICATIONS (Image 2 style) */}
                      <div className="bg-[#0d0d12] border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="text-xs font-black text-white uppercase tracking-wider font-sans">
                                Proporção e Custódia de Ativos
                              </h4>
                              <span className="text-[10px] text-gray-400 font-sans block mt-1">
                                Peso ponderado de cotas custodiadas e rentabilidade individual
                              </span>
                            </div>
                            <span className="text-[10px] bg-white/5 border border-white/10 text-gray-300 py-1 px-2.5 rounded-lg font-mono">
                              Total: {simulatedAssets.length} ativos
                            </span>
                          </div>

                          <div className="space-y-4">
                            {simulatedAssets.map((asset) => {
                              const totalVal = asset.cotacao * asset.qtd;
                              const pct = currentAssetsValue > 0 ? (totalVal / currentAssetsValue) * 100 : 0;
                              const performance = ((asset.cotacao - asset.precoMedio) / asset.precoMedio) * 100;
                              return (
                                <div key={asset.ticker} className="space-y-1.5">
                                  <div className="flex items-center justify-between text-[11px] font-sans">
                                    <div className="flex items-center gap-2">
                                      <span className="font-extrabold text-[#fb923c] bg-[#fb923c]/10 px-2 py-0.5 rounded text-[10px] tracking-wider">
                                        {asset.ticker}
                                      </span>
                                      <span className="text-gray-400 text-[10px] truncate max-w-[120px]">
                                        {asset.empresa}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3 font-mono text-xs">
                                      <span className="text-gray-200 font-bold">R$ {totalVal.toFixed(2)}</span>
                                      <span className={performance >= 0 ? "text-green-400 font-bold" : "text-rose-400 font-bold"}>
                                        {performance >= 0 ? "+" : ""}{performance.toFixed(1)}%
                                      </span>
                                      <span className="text-gray-500 text-[10px]">({(currentAssetsValue > 0 ? (totalVal / currentAssetsValue) * 100 : 0).toFixed(1)}%)</span>
                                    </div>
                                  </div>
                                  
                                  {/* Custom progress background bar matching premium guidelines */}
                                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex">
                                    <div 
                                      className="h-full rounded-full transition-all duration-500" 
                                      style={{ 
                                        width: `${currentAssetsValue > 0 ? (totalVal / currentAssetsValue) * 100 : 0}%`,
                                        background: `linear-gradient(90deg, ${asset.color || '#ea580c'}, #fb923c)` 
                                      }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Interactive simulation modal / trigger info */}
                        <div className="mt-5 p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3">
                          <div className="p-2 bg-amber-500 text-white rounded-xl">
                            <Plus size={14} />
                          </div>
                          <div className="text-[11px] leading-snug">
                            <span className="text-amber-400 font-extrabold block">Aporte Simulado Ativo</span>
                            <span className="text-gray-300 font-sans">Utilize o controle de transações B3 para injetar aportes táticos e reequilibrar esses pesos instantaneamente.</span>
                          </div>
                        </div>
                      </div>

                      {/* 2. PREMIUM DIVIDENDS CALENDAR WITH INTERACTIVE EVENTS (Image 3 style) */}
                      <div className="bg-[#0d0d12] border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="text-xs font-black text-white uppercase tracking-wider font-sans flex items-center gap-1.5">
                                <CalendarDays size={14} className="text-green-400" />
                                Calendário de Proventos — Junho 2026
                              </h4>
                              <span className="text-[10px] text-gray-400 font-sans block mt-1">
                                Dias destacados indicam recolhimento tático e fluxo de proventos
                              </span>
                            </div>
                            <span className="px-2 py-0.5 text-[9px] bg-green-500/10 text-green-400 border border-green-500/30 rounded-full font-bold uppercase">
                              Previsões B3
                            </span>
                          </div>

                          {/* 5x6 calendar grid */}
                          <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-sans">
                            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((dayName) => (
                              <span key={dayName} className="text-gray-500 font-bold py-1 select-none uppercase tracking-wider text-[8px]">
                                {dayName}
                              </span>
                            ))}

                            {/* Blank spaces before Jun 1, 2026 (which starts on Monday, seg) */}
                            <span className="py-2 opacity-50 select-none text-gray-600 font-mono">31</span>

                            {/* 30 days of June 2026 */}
                            {Array.from({ length: 30 }, (_, index) => {
                              const day = index + 1;
                              const isHighlightedOfDividend = day === 4 || day === 12 || day === 20;
                              const isSelected = selectedCalendarDay === day;
                              return (
                                <button
                                  key={day}
                                  onClick={() => setSelectedCalendarDay(day)}
                                  className={`py-1.5 rounded-xl transition-all font-mono font-bold flex flex-col items-center justify-center relative cursor-pointer group ${
                                    isSelected 
                                      ? "bg-green-600 text-white shadow-md scale-105" 
                                      : isHighlightedOfDividend
                                        ? "bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-[#303030] hover:text-white hover:border-transparent"
                                        : "bg-white/5 border border-white/5 text-gray-400 hover:bg-[#303030] hover:text-white hover:border-transparent"
                                  }`}
                                >
                                  <span>{day}</span>
                                  {isHighlightedOfDividend && !isSelected && (
                                    <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-green-500 group-hover:bg-green-400" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Selected dividend info pane inside card */}
                          <div className="mt-4 p-3 bg-white/5 rounded-2xl border border-white/10 min-h-[58px] flex flex-col justify-center text-[11px]">
                            {selectedCalendarDay === 4 ? (
                              <div className="font-sans">
                                <span className="font-extrabold text-green-400 block mb-0.5">04 de Junho de 2026</span>
                                <p className="text-gray-300">Provento creditado: <strong className="text-white">ITUB4</strong> — Recebimento consolidado de <strong className="text-white font-mono">R$ {(0.02 * simulatedAssets.find(a => a.ticker === "ITUB4")!.qtd).toFixed(2)}</strong> de Juros sobre Capital Próprio.</p>
                              </div>
                            ) : selectedCalendarDay === 12 ? (
                              <div className="font-sans">
                                <span className="font-extrabold text-green-400 block mb-0.5">12 de Junho de 2026</span>
                                <p className="text-gray-300">Previsão Proventos: <strong className="text-white">TAEE11</strong> — Recibos dividendos provisionados de <strong className="text-white font-mono">R$ {(0.91 * simulatedAssets.find(a => a.ticker === "TAEE11")!.qtd).toFixed(2)}</strong>.</p>
                              </div>
                            ) : selectedCalendarDay === 20 ? (
                              <div className="font-sans">
                                <span className="font-extrabold text-green-400 block mb-0.5">20 de Junho de 2026</span>
                                <p className="text-gray-300">Recolhimento Mensal: <strong className="text-white">PETR4</strong> — Pagamento provido tático de Dividendos de <strong className="text-white font-mono">R$ {(0.33 * simulatedAssets.find(a => a.ticker === "PETR4")!.qtd).toFixed(2)}</strong>.</p>
                              </div>
                            ) : (
                              <div className="text-gray-500 font-sans italic text-center select-none py-1">
                                Selecione um dia destacado do calendário (4, 12 ou 20) para ver o fluxo estimado de entrada de proventos B3.
                              </div>
                            )}
                          </div>

                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {activeTab === "ledger" && (
                  <div id="lite-ledger-view" className="space-y-6">
                    <div className="bg-white rounded-[28px] p-6 shadow-sm overflow-x-auto">
                      <div className="flex items-center justify-between mb-5">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider font-sans">
                          Extrato das Últimas Operações Registradas B3
                        </h4>
                        <button 
                          onClick={() => {
                            setTransactionsHistory([]);
                            setNotificationMsg("Extrato de operações limpo.");
                            setShowNotification(true);
                          }}
                          className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                        >
                          Limpar Histórico
                        </button>
                      </div>

                      <table className="w-full text-left border-collapse text-xs min-w-[600px] font-sans">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-extrabold uppercase text-[10px] tracking-wider">
                            <th className="py-3 pr-2">Data Lançamento</th>
                            <th className="py-3 px-2">Ticker Papel</th>
                            <th className="py-3 px-2">Tipo</th>
                            <th className="py-3 px-2 text-right">Quantidade</th>
                            <th className="py-3 px-2 text-right">Preço Unitário</th>
                            <th className="py-3 pl-2 text-right">Total Financeiro</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-slate-800">
                          {transactionsHistory.map((tx, idx) => {
                            const isVenda = tx.tipo.includes("VENDA") || tx.qtd < 0;
                            return (
                              <tr 
                                key={idx} 
                                className={`transition-colors duration-150 group ${
                                  isVenda 
                                    ? "hover:bg-[#F25534]" 
                                    : "hover:bg-[#75A43E]"
                                }`}
                              >
                                <td className="py-3.5 pr-2 font-mono text-gray-500 group-hover:text-white/90 transition-colors">{tx.data}</td>
                                <td className="py-3.5 px-2 font-bold text-slate-950 group-hover:text-white transition-colors">{tx.ticker}</td>
                                <td className="py-3.5 px-2">
                                  <span className={`px-2 py-0.5 rounded font-extrabold text-[9px] uppercase tracking-wide transition-all ${
                                    isVenda 
                                      ? "bg-red-50 text-red-600 border border-red-100 group-hover:bg-white/20 group-hover:text-white group-hover:border-white/30" 
                                      : "bg-green-50 text-green-600 border border-green-100 group-hover:bg-white/20 group-hover:text-white group-hover:border-white/30"
                                  }`}>
                                    {tx.tipo}
                                  </span>
                                </td>
                                <td className={`py-3.5 px-2 text-right font-bold transition-colors ${
                                  isVenda ? "text-red-600 group-hover:text-white" : "text-slate-900 group-hover:text-white"
                                }`}>
                                  {tx.qtd}
                                </td>
                                <td className="py-3.5 px-2 text-right font-mono text-gray-600 group-hover:text-white/90 transition-colors">R$ {tx.precoUnit.toFixed(2)}</td>
                                <td className="py-3.5 pl-2 text-right font-bold text-slate-950 group-hover:text-white font-mono transition-colors">R$ {tx.total.toFixed(2)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>

                    </div>
                  </div>
                )}

                {activeTab === "benchmarks" && (
                  <div id="lite-benchmarks-view" className="space-y-6">
                    <div className="bg-white border border-gray-150 rounded-[28px] p-6 shadow-sm">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider font-sans mb-3 text-center">
                        Benchmarks de Múltiplos por Setor Regra B3
                      </h4>
                      <p className="text-xs text-gray-500 mb-6 font-sans text-center">
                        Parâmetros ideais calculados com base na média histórica das maiores companhias abertas brasileiras
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {SECTOR_BENCHMARKS.map((item) => (
                          <div 
                            key={item.setor} 
                            className="p-4 rounded-2xl bg-slate-50 border border-gray-150 hover:bg-[#303030] hover:text-white hover:border-transparent transition-all group"
                          >
                            <span className="font-bold text-slate-950 group-hover:text-white text-xs block truncate mb-3 transition-colors">
                              {item.setor}
                            </span>
                            <div className="space-y-2 text-xs font-sans text-gray-600 group-hover:text-white/90 transition-colors">
                              <div className="flex justify-between py-1 border-b border-gray-100 group-hover:border-white/10 transition-colors">
                                <span>P/L Aceitável</span>
                                <span className="font-bold text-slate-950 group-hover:text-white transition-colors">{item.pl}</span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-gray-100 group-hover:border-white/10 transition-colors">
                                <span>P/VPA Mínimo</span>
                                <span className="font-bold text-slate-950 group-hover:text-white transition-colors">{item.pvpa || "N/A"}</span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-gray-100 group-hover:border-white/10 transition-colors">
                                <span>DY Exigido</span>
                                <span className="font-bold text-green-600 group-hover:text-green-400 transition-colors">{item.dy}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>
                )}

              </div>

            </div>
          ) : (
            <div id="workspace-view-dark" className="flex-1 bg-[#09090e] p-6 overflow-y-auto max-h-[600px] md:max-h-[calc(100vh-140px)] text-white">
              
              {/* Massive Title stats block - KPI display in center column */}
              <div id="dark-hero-header" className="mb-6 pb-6 border-b border-white/5">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-sans font-bold">
                  Painel de Análise Ativo — Estatísticas B3
                </span>
                <div className="flex flex-col md:flex-row md:items-baseline gap-2 mt-2">
                  <h1 className="text-4xl font-extrabold tracking-tight text-white font-sans [font-variant-numeric:tabular-nums]">
                    KPI {currentNetReturnPercent >= 0 ? "+" : ""}{currentNetReturnPercent.toFixed(2)}%
                  </h1>
                  <span className="text-lg font-bold text-amber-400 font-sans">
                    Margem Geral Segura ( Graham )
                  </span>
                </div>
              </div>

              {/* Grid of four interactive gauges matching Russian mock layout */}
              <div id="dark-gauges-grid" className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Gauge 1: VALOR TOTAL */}
                <IndicatorRing
                  id="ring-1-valuation"
                  label="Valor em Custódia"
                  subtitle={`R$ ${currentAssetsValue.toFixed(2)}`}
                  previousValue="R$ 1.090,20"
                  percentageChange="+4.5%"
                  isPositive={true}
                  value={60}
                  color="orange"
                />

                {/* Gauge 2: RENTABILIDADE */}
                <IndicatorRing
                  id="ring-2-rentability"
                  label="Rentabilidade Líquida"
                  subtitle={`R$ ${currentNetReturnVal.toFixed(2)}`}
                  previousValue="R$ -10,30"
                  percentageChange={`${currentNetReturnPercent >= 0 ? "+" : ""}${currentNetReturnPercent.toFixed(1)}%`}
                  isPositive={currentNetReturnPercent >= 0}
                  value={48}
                  color="crimson"
                />

                {/* Gauge 3: MARGEM DE CAIXA */}
                <IndicatorRing
                  id="ring-3-cash-margin"
                  label="Margem de Segurança"
                  subtitle={`${selectedAssetObj ? (selectedAssetObj.qtd > 2 ? "Forte" : "Moderada") : "N/A"}`}
                  previousValue="Estável"
                  percentageChange="+2.3%"
                  isPositive={true}
                  value={92}
                  color="green"
                />

                {/* Gauge 4: PROVENTOS CREDITADOS */}
                <IndicatorRing
                  id="ring-4-proventos"
                  label="Score Múltiplos Setor"
                  subtitle={`${selectedAssetObj ? selectedAssetObj.ticker : "Selecione"} comparado`}
                  previousValue="9.2x PL"
                  percentageChange="Em linha ▲"
                  isPositive={true}
                  value={75}
                  color="cyan"
                />

              </div>

            </div>
          )}

        </div>

    </div>
  );
}
